const { source: { url }} = require('./config');
const { applyTemplate, transformContent } = require('../../src/lib/templateManager');
const { collection } = require('@laufire/utils');
const gitManager = require('../../src/lib/gitManager');

const { map } = collection;

const createRepo = async (name, sourceUrl, destinationUrl) => {
	const { clone, remote } = gitManager(name, sourceUrl, destinationUrl);

	await clone();
	await remote();
};

const init = async ({
	name, template, repo: { url: destinationUrl }, content
}) => {
	await createRepo(`dist/${name}`, url, destinationUrl);

	const transformed = transformContent(content.concat({
		type: 'app',
		content: content,
		name: 'app',
	}), template, name, collection);

	map(transformed, ({ inputFileName, data, outputFileName }) =>
		applyTemplate(inputFileName, data, outputFileName));
};

module.exports = init;
