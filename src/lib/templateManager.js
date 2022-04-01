/* eslint-disable no-return-await */
const { renderFile } = require('ejs');
const collection = require('@laufire/utils/collection');
const { writeFileSync } = require('fs');

const { map, reduce, values } = collection;

const write = (outputFile, output) => writeFileSync(outputFile, output);

const compile = async (inputFile, data) => await renderFile(inputFile, data);

const properCase = (name) => `${ name.slice(0, 1).toUpperCase() }${ name.slice(1) }`;

const processConfig = async (context) => {
	const { config: { template, content: components }, lib } = context;
	const results = map(components, async (config) => {
		const { outputPath, template: file } = config;
		const output = await compile(`templates/${ template }/${ file }`,
			{ ...config, ...lib });

		return { path: outputPath, output: output };
	});

	return await Promise.all(values(results));
};

const processComponents = (source, config) => reduce(
	source, (
		acc, dummy, name,
	) => {
		const { results, components: [component], components } = acc;

		return {
			results: {
				...results,
				[name]: component,
			},
			components: components.slice(1),
		};
	}, { results: {}, components: config },
);

const processTemplate = async (context) => {
	const { config: { content: components }, config } = context;
	const resolved = await processConfig(context);
	const { results } = processComponents(components, resolved);

	return { ...context, config: { ...config, content: results }};
};

module.exports = { properCase, processTemplate, write };
