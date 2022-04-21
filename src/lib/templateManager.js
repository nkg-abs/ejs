const { renderFile } = require('ejs');
const { map } = require('@laufire/utils/collection');
const { writeFileSync } = require('fs');

const write = (outputFile, output) => writeFileSync(outputFile, output);

const compile = (inputFile, data) => renderFile(inputFile, data);

const properCase = (name) => `${ name.slice(0, 1).toUpperCase() }${ name.slice(1) }`;

// eslint-disable-next-line max-lines-per-function
const renderTemplates = async (context) => {
	const { config: { template, content: children }, lib, config } = context;
	const content = await Promise.all(map(children, async (child) => {
		const { outputPath, template: file, fileName, data } = child;
		const output = await compile(`templates/${ template }/${ file }`,
			{ ...child, ...lib, ...data });

		return {
			path: outputPath,
			output: output,
			fileName: fileName,
			action: 'write',
		};
	}));

	return {
		...context,
		config: {
			...config,
			content,
		},
	};
};

module.exports = {
	properCase,
	renderTemplates,
	write,
};
