const { reduce, keys, filter, map } = require('@laufire/utils/collection');
const { isIterable } = require('@laufire/utils/reflection');
const { properCase } = require('../../../src/lib/templateManager');

const iterableCount = (iterable) => keys(iterable).length;

const getServiceImports = ({ data: { child: { props }}, services }) =>
	reduce(
		props, (acc, value) => [
			...acc,
			...services.includes(`${ value }.js`)
				? [{
					modulePath: `services/${ value }.js`,
					name: value,
				}]
				: [],
		], [],
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
	map(props, (value) => (services.includes(`${ value }.js`)
		? `${ value }(context)`
		: JSON.stringify(value)));

const getData = (context) => {
	const { data: { child }, config: { theme }} = context;
	const { modules, data } = context;
	const { content, props, name, type } = child;
	const childCount = isIterable(content) ? iterableCount(content) : 0;

	return {
		childCount: childCount,
		imports: getImports(context),
		propCount: iterableCount(props),
		usesContext: Boolean(childCount),
		componentName: properCase(name),
		type: modules[theme].imports[type] ? properCase(type) : type,
		...getContent({ ...context, data: { ...data, childCount }}),
		props: buildProps(context),
	};
};

module.exports = getData;
