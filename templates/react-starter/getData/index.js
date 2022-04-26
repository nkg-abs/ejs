const {
	reduce, filter,
	map, find, length,
} = require('@laufire/utils/collection');
const { isIterable } = require('@laufire/utils/reflection');
const { properCase } = require('../../../src/lib/templateManager');
const { parts } = require('@laufire/utils/path');

const camelCase = (path) => {
	const [first, ...rest] = parts(path).slice(1);

	return `${ first }${ map(rest, properCase).join('') }`;
};

const findService = (computed, service) =>
	find(computed, ({ name: serviceName }) => service === serviceName);

const getServiceImports = ({ data: { child: { props }}, services }) =>
	reduce(
		props, (acc, value) => {
			const pathParts = parts(value).slice(1);
			const name = pathParts[pathParts.length - 1];

			return [
				...acc,
				...services.includes(`${ value }.js`)
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
	(isIterable(content)
		? reduce(
			content, (acc, { name: childName }) => [
				...acc,
				{
					modulePath: `./${ childName }`,
					name: `${ properCase(childName === name ? `${ childName }Child` : childName) }`,
				},
			], [],
		)
		: []);

const getThemeImports = (context) => {
	const { config: { theme }, modules } = context;
	const { data: { child: { type }}} = context;

	const typeExists = modules[theme].imports[type];

	return typeExists
		? [{
			modulePath: typeExists,
			name: properCase(type),
		}]
		: [];
};

const getImports = (context) => [
	...getChildrenImports(context),
	...getThemeImports(context),
	...getServiceImports(context),
];

const getContent = (context) => {
	const { data: { child, childCount }} = context;
	const { content, name } = child;

	return {
		textContent: childCount ? '' : content,
		children: childCount
			? {
				...filter(content, (config, childName) => childName !== name),
				...content[name] && { [`${ name }Child`]: { ...content[name], name: `${ name }Child` }},
			}
			: {},
	};
};

const buildProps = ({ data: { child: { props }}, services }) =>
	map(props, (value) => {
		const service = parts(value)[parts(value).length - 1];

		return services.includes(`${ value }.js`)
			? `${ camelCase(value) }(context)`
			: JSON.stringify(service);
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
		usesContext: Boolean(childCount),
		componentName: properCase(name),
		type: modules[theme].imports[type] ? properCase(type) : type,
		...getContent({ ...context, data: { ...data, childCount }}),
		props: buildProps(context),
	};
};

module.exports = getData;
