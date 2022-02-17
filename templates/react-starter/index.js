const { source } = require('./config');
const templateManager = require('../../src/lib/templateManager');
const prepareBase = require('../../src/lib/prepareBase');
const { renderTemplate } = templateManager;

const init = async (context) => {
	const { config: { content }, config } = context;

	await prepareBase({ ...context, source });

	await renderTemplate({
		...context,
		config: {
			...config,
			content: [
				...content,
				{
					type: 'app',
					content: content,
					name: 'app',
					fileName: 'App',
				},
			],
		},
	});
};

module.exports = init;
