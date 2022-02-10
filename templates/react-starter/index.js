const { source: { url }} = require('./config');
const { renderTemplate } = require('../../src/lib/templateManager');
const prepareBase = require('../../src/lib/prepareBase');
const { collection } = require('@laufire/utils');

const init = async (config) => {
	const { content } = config;

	await prepareBase({ config: { ...config, sourceUrl: url } });

	await renderTemplate({
		config: {
			...config,
			content: [
				...content,
				{
					type: 'app',
					content: content,
					name: 'app',
				}
			]
		}
	});
};

module.exports = init;
