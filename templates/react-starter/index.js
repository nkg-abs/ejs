const { source: { url }} = require('./config');
const applyTemplate = require('../../src/lib/templateManager');
const { collection: { map }} = require('@laufire/utils');
const gitManager = require('../../src/lib/gitManager');

const createRepo = async (name, sourceUrl, destinationUrl) => {
	const { clone, remote } = gitManager(name, sourceUrl, destinationUrl);

	await clone();
	await remote();
};

const init = async ({
	name, template, repo: { url: destinationUrl }, content
}) => {
	await createRepo(`dist/${name}`, url, destinationUrl);

	map(content, (component) => {
		const { name: componentName, type } = component;

		applyTemplate(
			`templates/${template}/${type}.ejs`, component, `dist/${name}/src/${componentName}.js`
		);
	});

	applyTemplate(
		`templates/${template}/app.ejs`, { App: content, map }, `dist/${name}/src/app.js`
	);
};

module.exports = init;
