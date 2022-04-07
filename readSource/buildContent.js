const { map, reduce } = require('@laufire/utils/collection');
const { isIterable } = require('@laufire/utils/reflection');

const getChildComponents = (context) => {
	const { data: { content }} = context;

	return isIterable(content)
		// eslint-disable-next-line no-use-before-define
		? getContent(context)
		: [];
};

const getFiles = ({ data: { config, config: { content }, files, parentKey }}) =>
	map(files, (file) => ({
		content: content,
		...file,
		...config,
		outputPath: parentKey,
	}));

const genReducer = (context) => {
	const { data: { parentKey }} = context;

	return (acc, component) => {
		const { name, content } = component;

		return [
			...acc,
			...getFiles({
				...context,
				data: { files: [
					{ template: 'component.ejs', fileName: 'index.js' },
					{	template: 'test.ejs',	fileName: 'index.test.js'	},
				], config: component, parentKey: `${ parentKey }/${ name }` },
			}),
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
			content: getContent({ ...context, data: { content: content, parentKey: `${ parentKey }/src` }}),
		},
	};
};

module.exports = buildContent;
