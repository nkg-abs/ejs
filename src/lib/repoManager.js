const gitManager = require('./gitManager');
const { properCase } = require('./templateManager');
const { map, reduce } = require('@laufire/utils/collection');
const { existsSync } = require('fs');
const shell = require('shelljs');
const { isIterable } = require('@laufire/utils/reflection');

const toBaseRelative = '../../';

const repoManager = {
	read: async (context) => {
		const { localPath } = context;
		const { log } = gitManager(localPath);
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
		const createBase = async ({ source }) => {
			shell.mkdir(targetPath);

			const { init, setRemote, pull } = gitManager(targetPath);

			await init();
			await setRemote(['add', 'origin', source]);
			await pull(['origin', 'master']);
		};

		existsSync(targetPath) || await createBase(context);
	},

	resetTarget: ({ targetPath }) => shell.exec(`sh ./${ targetPath }/reset.sh`),

	normalizeContent: (context) => {
		const { config: { content: components }, config } = context;

		const buildContent = (components) => map(components, (component, key) => {
			const { content } = component;

			const childContent = isIterable(content)
				? buildContent(content)
				: content;

			return {
				name: key,
				...component,
				content: childContent,
			};
		});
		const normalizedContent = buildContent(components);

		return { ...context, config: { ...config, content: normalizedContent }};
	},
};

module.exports = repoManager;
