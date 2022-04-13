const { reduce } = require('@laufire/utils/collection');
const getData = require('./getData');

// eslint-disable-next-line max-lines-per-function
const getTemplates = (context) => {
	const { config: { content: files }, config } = context;

	const content = reduce(
		files, (acc, file) => {
			const data = {
				...file,
				data: { ...getData({ ...context, data: { child: file }}) },
			};

			return [
				...acc,
				{
					...data,
					template: 'component.ejs',
					fileName: 'index.js',
				},
				{
					...data,
					template: 'test.ejs',
					fileName: 'index.test.js',
				},
			];
		}, [],
	);

	return { ...context, config: { ...config, content }};
};

module.exports = getTemplates;
