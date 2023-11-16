const {	reduce, filter } = require('@laufire/utils/collection');
const getData = require('./getData');
const { isCustomComponent } = require('./helpers');

const getFiles = (context) => {
	const { data: child } = context;
	const fileData = {
		...child,
		data: { ...getData({ ...context, data: { child }}) },
	};

	return [
		{
			...fileData,
			template: 'component/index.ejs',
			fileName: 'index.js',
		},
		{
			...fileData,
			template: 'test/index.ejs',
			fileName: 'index.test.js',
		},
	];
};

const getTemplates = (context) => {
	const { config: { content: files }, config } = context;
	const dynamicFiles = filter(files, (file) =>
		!isCustomComponent({ ...context, data: file.type })
		&& file.type !== 'simple');

	const content = reduce(
		dynamicFiles, (acc, file) => [
			...acc,
			...getFiles({ ...context, data: file }),
		], [],
	);

	return { ...context, config: { ...config, content }};
};

module.exports = getTemplates;
