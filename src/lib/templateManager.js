const { renderFile } = require('ejs');
const collection = require('@laufire/utils/collection');
const { writeFileSync } = require('fs');

const { map, values } = collection;

const write = (outputFile, output) => writeFileSync(outputFile, output);

const compile = (inputFile, data) => renderFile(inputFile, data);

const properCase = (name) => `${ name.slice(0, 1).toUpperCase() }${ name.slice(1) }`;

const processConfig = (context) => {
	const { config: { template, content: components }, lib } = context;
	const results = map(components, async (config) => {
		const { outputPath, template: file, fileName } = config;
		const output = await compile(`templates/${ template }/${ file }`,
			{ ...config, ...lib });

		return {
			path: outputPath,
			output: output,
			fileName: fileName,
		};
	});

	return Promise.all(values(results));
};

const processTemplate = async (context) => {
	const { config } = context;
	const resolved = await processConfig(context);

	return { ...context, config: { ...config, content: resolved }};
};

module.exports = { properCase, processTemplate, write };
