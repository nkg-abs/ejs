const { reduce } = require('@laufire/utils/collection');

const getTemplates = (context) => {
	const { config: { content: files }, config } = context;

	const content = reduce(
		files, (acc, file) => [
			...acc,
			{ ...file, template: 'component.ejs', fileName: 'index.js' },
			{ ...file, template: 'test.ejs',	fileName: 'index.test.js' },
		], [],
	);

	return { ...context, config: { ...config, content }};
};

module.exports = getTemplates;
