const {
	reduce, filter,
	map, find, length,
} = require('@laufire/utils/collection');
const { isIterable } = require('@laufire/utils/reflection');
const { properCase, camelCase } = require('../../../src/lib/templateManager');
const { parts } = require('@laufire/utils/path');

const isService = ({ data: { value: service }, services }) =>
	services.includes(`${ service }.js`);

const isServiceExists = (context) => {
	const { data: { child: { props }}} = context;

	find(props, (value) => isService({ ...context, data: { value }}));
};

const addSuffix = (componentName) => `${ componentName }Child`;

const findService = (acc, service) =>
	find(acc, ({ name: serviceName }) => service === serviceName);

const getPropServices = (context) => {
	const { data: { child: { props }}} = context;

	return reduce(
		props, (acc, value) => {
			const pathParts = parts(value).slice(1);
			const name = pathParts[pathParts.length - 1];

			return [
				...acc,
				...isService({ ...context, data: { value }})
					? [{
						modulePath: `services/${ value }`,
						name: findService(acc, name)
							? camelCase(value)
							: name,
					}]
					: [],
			];
		}, [],
	);
};

const getChildComponets = ({ data: { child: { name, content }}}) =>
	isIterable(content) && reduce(
		content, (acc, { name: childName }) => [
			...acc,
			{
				modulePath: `./${ childName }`,
				name: `${ properCase(childName === name ? addSuffix(childName) : childName) }`,
			},
		], [],
	);

const getThemeImports = (context) => {
	const { config: { theme }, modules } = context;
	const { data: { child: { type }}} = context;

	const typeExists = modules[theme].imports[type];

	return typeExists && [{
		modulePath: typeExists,
		name: properCase(type),
	}];
};

const buildServiceImports = (context) => {
	const { data: { child: { content }}, servicesPath } = context;

	return isService({ ...context, data: { value: content }}) && [{
		modulePath: `${ servicesPath }/${ content }`,
		name: content,
	}];
};

const getContentServices = (context) => {
	const { data: { child: { content }}} = context;

	return !isIterable(content) && buildServiceImports(context);
};

const getImports = (context) =>
	map([
		getChildComponets,
		getThemeImports,
		getPropServices,
		getContentServices,
	], (fn) => fn(context) || []).flat();

const getContent = (context) => {
	const { data: { child, childCount }} = context;
	const { content, name } = child;

	return {
		textContent: childCount ? '' : content,
		children: childCount
			? {
				...filter(content, (config, childName) => childName !== name),
				...content[name] && {
					[addSuffix(name)]: {
						...content[name],
						name: addSuffix(name),
					},
				},
			}
			: {},
	};
};

const buildProps = (context) => {
	const { data: { child: { props }}} = context;

	return map(props, (value) => {
		const pathParts = parts(value);
		const leaf = pathParts[pathParts.length - 1];

		return isService({ ...context, data: { value }})
			? `${ camelCase(value) }(context)`
			: Number(leaf) ? `${ leaf }` : `'${ leaf }'`;
	});
};

const getData = (context) => {
	const { data: { child }, config: { theme }} = context;
	const { modules, data } = context;
	const { content, props, name, type } = child;
	const childCount = isIterable(content) ? length(content) : 0;

	return {
		childCount: childCount,
		imports: getImports(context),
		propCount: length(props),
		usesContext: Boolean(childCount) || isServiceExists(context),
		componentName: properCase(name),
		type: modules[theme].imports[type] ? properCase(type) : type,
		...getContent({ ...context, data: { ...data, childCount }}),
		props: buildProps(context),
	};
};

module.exports = getData;
