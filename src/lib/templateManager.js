const { renderFile } = require('ejs');
const { map } = require('@laufire/utils/collection');
const { writeFileSync } = require('fs');

const write = (outputFile, output) => writeFileSync(outputFile, output);

const compile = (inputFile, data) => renderFile(inputFile, data);

const properCase = (name) => `${ name.slice(0, 1).toUpperCase() }${ name.slice(1) }`;

const processTemplate = async (context) => {
	const { config: { template, content }, lib, config } = context;
	const renderTemplates = await Promise.all(map(content, async (child) => {
		const { outputPath, template: file, fileName } = child;
		const output = await compile(`templates/${ template }/${ file }`,
			{ ...child, ...lib });

		return {
			path: outputPath,
			output: output,
			fileName: fileName,
		};
	}));

	return {
		...context,
		config: {
			...config,
			content: renderTemplates,
		},
	};
};

module.exports = { properCase, processTemplate, write };
