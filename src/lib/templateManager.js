const { renderFile } = require('ejs');
const shell = require('shelljs');
const collection = require('@laufire/utils/collection');
const { writeFileSync, existsSync } = require('fs');

const { map, reduce, values } = collection;

const write = (outputFile, output) => writeFileSync(outputFile, output);

const compile = async (inputFile, data) => await renderFile(inputFile, data);

const properCase = (name) => `${ name.slice(0, 1).toUpperCase() }${ name.slice(1) }`;

const prepareStructure = ({ directories, output }) =>
	reduce(
		directories, (acc, dir) => {
			const currentPath = `${ acc }/${ dir }`;
			const createComponent = () => {
				shell.mkdir(currentPath);
				write(`${ currentPath }/index.js`, output);
			};

			existsSync(currentPath) || createComponent();

			return currentPath;
		}, '.',
	);

const processTemplate = async (context) => {
	const { config: { template, content: components }, lib } = context;

	const results = map(components, async (data) => {
		const { outputPath } = data;
		const output = await compile(`templates/${ template }/component.ejs`,
		{ ...data, ...lib });

		return { path: outputPath, output };
	});

	const config = await Promise.all(values(results));
	const { results: resolved } = reduce(components, (acc, value, name) => {
		const { results, components: [component], components } = acc;

		return { results: { ...results, [name]: component }, components: components.slice(1)}
	}, { results: {}, components: config });

	context.config.content = resolved;
};

module.exports = { properCase, processTemplate, prepareStructure, write };
