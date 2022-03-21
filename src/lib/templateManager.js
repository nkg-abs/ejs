const { renderFile } = require('ejs');
const shell = require('shelljs');
const collection = require('@laufire/utils/collection');
const { writeFileSync, existsSync } = require('fs');

const { map, reduce } = collection;

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

const processTemplate = (context) => {
	const { config: { template, content: components }, lib } = context;

	map(components, async (data) => {
		const { outputPath } = data;
		const directories = outputPath.split('/').filter((dir) =>
			!['.', 'index.js'].includes(dir));
		const output = await compile(`templates/${ template }/component.ejs`,
			{ ...data, ...lib });

		prepareStructure({ directories, output });
	});
};

module.exports = { properCase, processTemplate };
