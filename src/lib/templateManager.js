const { renderFile } = require('ejs');
const { promises: { writeFile } } = require('fs');

const write = async (outputFile, output) => await writeFile(outputFile, output);

const compile = async (inputFile, data) => await renderFile(inputFile, data);

const applyTemplate = async (inputFile, data, outputFile) => {
	const output = await compile(inputFile, data);
	await write(outputFile, output);
};

module.exports = applyTemplate;
