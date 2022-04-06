const shell = require('shelljs');
const { existsSync } = require('fs');
const { isIterable } = require('@laufire/utils/reflection');
const { map, reduce, keys } = require('@laufire/utils/collection');
const gitManager = require('./gitManager');
const { properCase } = require('./templateManager');

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

const getChildComponents = (context) => {
	const { data: { content }} = context;

	return isIterable(content)
		// eslint-disable-next-line no-use-before-define
		? getContent(context)
		: [];
};

const getFiles = ({ data: { config, config: { content }, files, parentKey }}) =>
	map(files, (file) => ({
		content: content,
		...file,
		...config,
		outputPath: parentKey,
	}));

const genReducer = (context) => {
	const { data: { parentKey }} = context;

	return (acc, component) => {
		const { name, content } = component;

		return [
			...acc,
			...getFiles({
				...context,
				data: { files: [
					{ template: 'component.ejs', fileName: 'index.js' },
					{	template: 'test.ejs',	fileName: 'index.test.js'	},
				], config: component, parentKey: `${ parentKey }/${ name }` },
			}),
			...getChildComponents({
				...context,
				data: { content: content, parentKey: `${ parentKey }/${ name }` },
			}),
		];
	};
};

const getContent = (context) => {
	const { data: { content: components }} = context;

	return reduce(
		components, genReducer(context), [],
	);
};

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

	buildContext: (context) => ({
		...context,
		lib: { map, properCase, keys, isIterable },
	}),

	processTemplate: (context) => {
		const { config: { template }} = context;
		const init = require(`${ toBaseRelative }templates/${ template }/index`);

		return init(context);
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
		const { config: { content }, config, targetPath: parentKey } = context;

		return {
			...context,
			config: {
				...config,
				content: getContent({ ...context, data: { content: content, parentKey: `${ parentKey }/src` }}),
			},
		};
	},
};

module.exports = repoManager;
