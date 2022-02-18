const gitManager = require('./gitManager');
const { properCase } = require('./templateManager');
const { map, reduce } = require('@laufire/utils/collection');
const { existsSync } = require('fs');

const toBaseRelative = '../../';

const repoManager = {
	read: async (context) => {
		const { localPath } = context;
		const { clone } = gitManager({ ...context, localPath: '' });

		existsSync(localPath) || await clone(localPath);
		const { log } = gitManager(context);
		const { latest } = await log();
		const details = reduce(
			latest, (
				acc, value, key,
			) => ({ ...acc, [key.slice(key.indexOf('_') + 1)]: value }), {},
		);
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
