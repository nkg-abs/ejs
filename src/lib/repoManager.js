const gitManager = require('./gitManager');
const { properCase } = require('./templateManager');
const { map } = require('@laufire/utils/collection');

const toBaseRelative = '../../';

const repoManager = {
	read: async (context) => {
		const { localPath } = context;
		const { clone } = gitManager(context);

		await clone();
		const { log } = gitManager(context);
		const { latest: details } = await log();
		const config = require(`${ toBaseRelative }${ localPath }/config`);

		return { ...context, config, details };
	},

	buildContext: (context) => ({ ...context, lib: { map, properCase }}),

	processTemplate: async (context) => {
		const { config: { template }} = context;
		const init = require(`${ toBaseRelative }templates/${ template }/index`);

		await init(context);
	},
};

module.exports = repoManager;
