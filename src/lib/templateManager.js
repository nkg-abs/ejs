const { renderFile } = require('ejs');
const { promises: { writeFile } } = require('fs');
const collection = require('@laufire/utils/collection');

const { map } = collection;

const write = async (outputFile, output) => await writeFile(outputFile, output);

const compile = async (inputFile, data) => await renderFile(inputFile, data);

const applyTemplate = async ({ inputFileName, data, outputFileName }) => {
	const output = await compile(inputFileName, data);
	await write(outputFileName, output);
};

const transformContent = ({ content, template, name, lib }) =>
	map(content, ({ content, type, name: componentName }) => ({
			inputFileName: `templates/${template}/${type}.ejs`,
			data: { content, name: componentName, ...lib },
			outputFileName: `dist/${name}/src/${componentName}.js`,
		})
	);

const renderTemplate = async ({ config }) => {
	const transformed = transformContent({ ...config, lib: collection });
	await map(transformed, applyTemplate);
};

module.exports = { renderTemplate };
