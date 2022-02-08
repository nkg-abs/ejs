const { renderFile } = require('ejs');
const { promises: { writeFile } } = require('fs');
const { map } = require('@laufire/utils/collection');

const write = async (outputFile, output) => await writeFile(outputFile, output);

const compile = async (inputFile, data) => await renderFile(inputFile, data);

const applyTemplate = async ({ inputFileName, data, outputFileName }) => {
	const output = await compile(inputFileName, data);
	await write(outputFileName, output);
};

const transformContent = (components, template, name, lib) =>
	map(components, ({ content , type, name: componentName }) => ({
			inputFileName: `templates/${template}/${type}.ejs`,
			data: { content, name: componentName, ...lib },
			outputFileName: `dist/${name}/src/${componentName}.js`,
		})
	);

module.exports = { applyTemplate, transformContent };
