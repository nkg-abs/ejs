const gitManager = require('./gitManager');
const { properCase } = require('./templateManager');
const { map, reduce, keys } = require('@laufire/utils/collection');
const { existsSync } = require('fs');
const shell = require('shelljs');
const { isIterable } = require('@laufire/utils/reflection');

const toBaseRelative = '../../';

const normalizeChild = (components) =>
	map(components, (component, key) => {
		const { content } = component;

		const childContent = isIterable(content)
			? normalizeChild(content)
			: content;

		return {
			name: key,
			...component,
			content: childContent,
		};
	});

const reduceChild = (components, parentKey = '') => reduce(
	components, (acc, component) => {
		const { name, content } = component;
		const iterable = isIterable(content);

		const childComponents = iterable && reduceChild(content, `${ parentKey }/${ name }`);

		return {
			...acc,
			[name]: {
				...component,
				template: 'component.ejs',
				fileName: 'index.js',
				content: content,
				outputPath: `./${ parentKey }/${ name }/index.js`,
			},
			...childComponents,
		};
	}, {},
);

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

	buildContext: (context) => ({ ...context, lib: { map, properCase, keys, isIterable }}),

	processTemplate: async (context) => {
		const { config: { template }} = context;
		const init = require(`${ toBaseRelative }templates/${ template }/index`);

		return await init(context);
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
		const { config: { content }, config } = context;

		return {
			...context,
			config: {
				...config,
				content: normalizeChild(content),
			},
		};
	},

	buildContent: (context) => {
		const { config: { content }, config, targetPath } = context;

		return {
			...context,
			config: {
				...config,
				content: reduceChild(content, `${ targetPath }/src`),
			},
		};
	},
};

module.exports = repoManager;
