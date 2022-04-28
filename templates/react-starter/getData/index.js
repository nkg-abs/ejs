const {
	reduce, filter,
	map, find, length,
} = require('@laufire/utils/collection');
const { isIterable } = require('@laufire/utils/reflection');
const { properCase, camelCase } = require('../../../src/lib/templateManager');
const { parts } = require('@laufire/utils/path');

const isService = (services, service) => services.includes(`${ service }.js`);

const isServiceExists = ({ data: { child: { props }}, services }) =>
	find(props, (value) => isService(services, value));

const addSuffix = (componentName) => `${ componentName }Child`;

const findService = (acc, service) =>
	find(acc, ({ name: serviceName }) => service === serviceName);

const getServiceImports = ({ data: { child: { props }}, services }) =>
	reduce(
		props, (acc, value) => {
			const pathParts = parts(value).slice(1);
			const name = pathParts[pathParts.length - 1];

			return [
				...acc,
				...isService(services, value)
					? [{
						modulePath: `services/${ value }.js`,
						name: findService(acc, name)
							? camelCase(value)
							: name,
					}]
					: [],
			];
		}, [],
	);

const getChildrenImports = ({ data: { child: { name, content }}}) =>
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

const getImports = (context) =>
	map([
		getChildrenImports,
		getThemeImports,
		getServiceImports,
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

const buildProps = ({ data: { child: { props }}, services }) =>
	map(props, (value) => {
		const pathParts = parts(value);
		const leaf = pathParts[pathParts.length - 1];

		return isService(services, value)
			? `${ camelCase(value) }(context)`
			: Number(leaf) ? `${ leaf }` : `'${ leaf }'`;
	});

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
