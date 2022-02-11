const { source: { url }} = require('./config');
const templateManager = require('../../src/lib/templateManager');
const prepareBase = require('../../src/lib/prepareBase');
const saveCode = require('../../src/lib/saveCode');
const { renderTemplate } = templateManager;

const init = async ({ config }) => {
	const { content, name } = config;

	await prepareBase({ config: { ...config, sourceUrl: url }});

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

	await saveCode({ config: { ...config, sourceUrl: url, path: `./dist/${ name }/` }});
};

module.exports = init;
