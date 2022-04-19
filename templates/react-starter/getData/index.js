const { reduce, keys } = require('@laufire/utils/collection');
const { isIterable } = require('@laufire/utils/reflection');
const { properCase } = require('../../../src/lib/templateManager');

const iterableCount = (iterable) => keys(iterable).length;

// eslint-disable-next-line max-lines-per-function
const getImports = (context) => {
	const { config: { theme }, modules } = context;
	const { data: { child: { content, type }}} = context;
	const typeExists = modules[theme].imports[type];

	const childrenComponents = isIterable(content)
		? reduce(
			content, (acc, { name }) => [
				...acc,
				{
					modulePath: `./${ name }`,
					name: properCase(name),
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
	};
};

module.exports = getData;
