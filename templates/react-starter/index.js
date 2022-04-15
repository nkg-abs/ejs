const { reduce } = require('@laufire/utils/collection');
const getData = require('./getData');

const getFiles = (context) => {
	const { data: { file }} = context;
	const fileData = {
		...file,
		data: { ...getData({ ...context, data: { child: file }}) },
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

	const content = reduce(
		files, (acc, file) => [
			...acc,
			...getFiles({ ...context, data: { file }}),
		], [],
	);

	return { ...context, config: { ...config, content }};
};

module.exports = getTemplates;
