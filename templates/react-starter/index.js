const { source: { url }} = require('./config');
const { applyTemplate, transformContent } = require('../../src/lib/templateManager');
const prepareBase = require('../../src/lib/prepareBase');
const { collection } = require('@laufire/utils');

const { map } = collection;

const init = async (config) => {
	const { content, name, template } = config;

	await prepareBase({ config: { ...config, sourceUrl: url } });

	const transformed = transformContent([ ...content, {
		type: 'app',
		content: content,
		name: 'app',
	}], template, name, collection);

	map(transformed, applyTemplate);
};

module.exports = init;
