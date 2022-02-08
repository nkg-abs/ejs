const { source: { url }} = require('./config');
const { applyTemplate, transformContent } = require('../../src/lib/templateManager');
const { collection } = require('@laufire/utils');
const gitManager = require('../../src/lib/gitManager');

const { map } = collection;

const createRepo = async (config) => {
	const { clone, remote } = gitManager(config);

	await clone();
	await remote();
};

const init = async ({
	name, template, repo: { url: destinationUrl }, content
}) => {
	await createRepo({
		name: `dist/${name}`,
		sourceUrl: url,
		destinationUrl
	});

	const transformed = transformContent(content.concat({
		type: 'app',
		content: content,
		name: 'app',
	}), template, name, collection);

	map(transformed, applyTemplate);
};

module.exports = init;
