const gitManager = require('./gitManager');
const { properCase } = require('./templateManager');
const { map, reduce } = require('@laufire/utils/collection');
const { existsSync } = require('fs');
const shell = require('shelljs');

const toBaseRelative = '../../';

const repoManager = {
	read: async (context) => {
		const { localPath } = context;
		const { log } = gitManager(context);
		const { latest } = await log();
		const details = reduce(
			latest, (
				acc, value, key,
			) => ({ ...acc, [key.slice(key.indexOf('_') + 1)]: value }), {},
		);
		const config = require(`${ toBaseRelative }${ localPath }/config`);
		const { name } = config;
		const targetPath = `dist/${ name }`;

		return { ...context, config, details, targetPath };
	},

	buildContext: (context) => ({ ...context, lib: { map, properCase }}),

	processTemplate: async (context) => {
		const { config: { template }} = context;
		const init = require(`${ toBaseRelative }templates/${ template }/index`);

		await init(context);
	},

	ensureTarget: async (context) => {
		const { targetPath } = context;

		existsSync(targetPath) || await gitManager({
			...context,
			localPath: '',
		}).clone(targetPath);
	},

	resetTarget: ({ targetPath }) => shell.exec(`sh ./${ targetPath }/reset.sh`),

};

module.exports = repoManager;
