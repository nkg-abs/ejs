const { reduce } = require('@laufire/utils/collection');
const { isIterable } = require('@laufire/utils/reflection');

const getChildComponents = (context) => {
	const { data: { content }} = context;

	return isIterable(content)
		// eslint-disable-next-line no-use-before-define
		? getContent(context)
		: [];
};

const genReducer = (context) => {
	const { data: { parentKey }} = context;

	return (acc, component) => {
		const { name, content } = component;

		return [
			...acc,
			{
				...component,
				outputPath: `./${ parentKey }/${ name }`,
			},
			...getChildComponents({
				...context,
				data: { content: content, parentKey: `${ parentKey }/${ name }` },
			}),
		];
	};
};

const getContent = (context) => {
	const { data: { content: components }} = context;

	return reduce(
		components, genReducer(context), [],
	);
};

const buildContent = (context) => {
	const { config: { content }, config, targetPath: parentKey } = context;

	return {
		...context,
		config: {
			...config,
			content: getContent({
				...context,
				data: {
					content: content,
					parentKey: `${ parentKey }/src`,
				},
			}),
		},
	};
};

module.exports = buildContent;
