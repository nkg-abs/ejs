/* eslint-disable complexity */
const { reduce, keys, filter } = require('@laufire/utils/collection');
const { isIterable } = require('@laufire/utils/reflection');
const { properCase } = require('../../../src/lib/templateManager');

const iterableCount = (iterable) => keys(iterable).length;

// eslint-disable-next-line max-lines-per-function
const getImports = (context) => {
	const { config: { theme }, modules } = context;
	const { data: { child: { name, content, type }}} = context;
	const typeExists = modules[theme].imports[type];

	const childrenComponents = isIterable(content)
		? reduce(
			content, (acc, { name: childName }) => [
				...acc,
				{
					modulePath: `./${ childName }`,
					name: `${ properCase(childName === name ? `${ childName }Child` : childName) }`,
				},
			], [],
		)
		: [];
	const importedComponents = typeExists
		? [{
			modulePath: typeExists,
			name: properCase(type),
		}]
		: [];

	return [...childrenComponents, ...importedComponents];
};

// eslint-disable-next-line max-lines-per-function
const getData = (context) => {
	const { data: { child }, config: { theme }, modules } = context;
	const { content, props, name, type } = child;
	const childCount = isIterable(content) ? iterableCount(content) : 0;
	const imports = getImports(context);

	return {
		childCount: childCount,
		imports: imports,
		propCount: iterableCount(props),
		usesContext: Boolean(childCount),
		componentName: properCase(name),
		type: modules[theme].imports[type] ? properCase(type) : type,
		textContent: childCount ? '' : content,
		children: childCount
			? {
				...filter(content, (config, childName) => childName !== name),
				...content[name] && { [`${ name }Child`]: { ...content[name], name: `${ name }Child` }},
			}
			: {},
	};
};

module.exports = getData;
