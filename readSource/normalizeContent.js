const { isIterable } = require('@laufire/utils/reflection');
const { map } = require('@laufire/utils/collection');

const normalizeChild = (components) =>
	map(components, (component, key) => {
		const { content, props } = component;

		const childContent = isIterable(content)
			? normalizeChild(content)
			: content;

		return {
			name: key,
			props: props || {},
			type: 'div',
			...component,
			content: childContent,
		};
	});

const normalizeContent = (context) => {
	const { config: { content }, config } = context;

	return {
		...context,
		config: {
			...config,
			content: normalizeChild(content),
		},
	};
};

module.exports = normalizeContent;
