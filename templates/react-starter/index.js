const { source } = require('./config');
const templateManager = require('../../src/lib/templateManager');
const prepareBase = require('../../src/lib/prepareBase');
const saveCode = require('../../src/lib/saveCode');
const { renderTemplate } = templateManager;

const init = async (context) => {
	const { config: { content, name }, config } = context;

	await prepareBase({ ...context, source });

	await renderTemplate({
		config: {
			...config,
			content: [
				...content,
				{
					type: 'app',
					content: content,
					name: 'app',
					fileName: 'App'
				}
			],
		},
	});

	await saveCode({ ...context, source, path: `./dist/${ name }/` });
};

module.exports = init;
