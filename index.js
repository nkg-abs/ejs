const { map } = require('@laufire/utils/collection');
const { properCase } = require('./src/lib/templateManager');
const gitManager = require('./src/lib/gitManager');

const render = async () => {
	const initialConfig = { config: {}, source: 'git@github.com:nkg-laufire/simpleUI.git', localPath: 'appConfig'}
	const { clone } = gitManager(initialConfig);
	await clone();
	const config = require('./appConfig/config');
	const init = require(`./templates/${config.template}/index.js`);

	init({ config: { ...config, lib: { map, properCase } }});
};

render();
