const { source: { url }} = require('./config');
const { readAndWrite } = require('../../src/lib/templateManager');
const { collection: { map }} = require('@laufire/utils');
const simpleGit = require('simple-git');

const git = simpleGit();
const createRepo = async (name, destinationUrl) => {
	await git
	.clone(url, `dist/${name}`)
	.remote('set-url', 'origin', destinationUrl);
}

const init = async ({
	name, template, repo: { url: destinationUrl }, content
}) => {
	await createRepo(name, destinationUrl);

	map(content, (component) => {
		const { name: componentName, type } = component;

		readAndWrite(
			`templates/${template}/${type}.ejs`, component, `dist/${name}/src/${componentName}.js`
		);
	});

	readAndWrite(
		`templates/${template}/app.ejs`, { App: content, map }, `dist/${name}/src/app.js`
	);
}

module.exports = init;
