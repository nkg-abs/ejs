const { map } = require('@laufire/utils/collection');
const { properCase } = require('./src/lib/templateManager');
const gitManager = require('./src/lib/gitManager');

const render = async () => {
	const localPath = 'appConfig';
	const initialConfig = { config: {}, source: 'git@github.com:nkg-laufire/simpleUI.git', localPath };
	const { clone } = gitManager(initialConfig);
	await clone();
	const { log } = gitManager({ ...initialConfig, path: localPath});
	const { latest: details } = await log();
	const config = require(`./${ localPath }/config`);
	const init = require(`./templates/${config.template}/index.js`);

	init({ config: { ...config, lib: { map, properCase }, details }});
};

render();
