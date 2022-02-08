const {
	name, template, repo: { url: destinationUrl }, content
} = require('./config');
const { source: { url }} = require(`./templates/${ template }/config.js`);
const { readAndWrite } = require('./src/lib/templateManager');
const { collection: { map }} = require('@laufire/utils');
const simpleGit = require('simple-git');

const git = simpleGit();
const createRepo = async () => {
	await git
	.clone(url, `dist/${name}`)
	.remote('set-url', 'origin', 'https://github.com/user/repo2.git');
}

const init = async () => {
	await createRepo();

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

init();
