const gitManager = require('./gitManager');
const { properCase } = require('./templateManager');
const { map } = require('@laufire/utils/collection');

const localPath = 'dist/appConfig';
const initialConfig = { config: {}, source: 'git@github.com:nkg-laufire/simpleUI.git', localPath };
const toBaseRelative = '../../';

const repoManager = {
	read: async () => {
		const { clone } = gitManager(initialConfig);
		await clone();
	},

	buildContext: async () => {
		const { log } = gitManager({ ...initialConfig, path: localPath});
		const { latest: details } = await log();
		const config = require(`${toBaseRelative}${ localPath }/config`);
		return { config: { ...config, lib: { map, properCase }, details }};
	},

	processTemplate: async (context) => {
		const { config: { template }} = context;
		const init = require(`${toBaseRelative}templates/${ template }/index`);

		await init(context);
	},
};

module.exports = repoManager;
