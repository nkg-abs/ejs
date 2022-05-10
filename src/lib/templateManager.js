const { renderFile } = require('ejs');
const { map, reduce } = require('@laufire/utils/collection');
const { parts } = require('@laufire/utils/path');
const { writeFileSync } = require('fs');
const { readFile, tranformPath } = require('./helpers');

const write = (outputFile, output) => writeFileSync(outputFile, output);

const compile = (inputFile, data) => renderFile(inputFile, data);

const properCase = (name) => `${ name.slice(0, 1).toUpperCase() }${ name.slice(1) }`;

const camelCase = (servicePath) => {
	const [dir, ...remainingPath] = parts(servicePath).slice(1);

	return `${ dir }${ map(remainingPath, properCase).join('') }`;
};

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

// eslint-disable-next-line max-lines-per-function
const copyCustomization = (context) => {
	const { read, targetPath, config, config: { content }} = context;

	return {
		...context,
		config: {
			...config,
			content: [
				...content,
				...reduce(
					read, (
						acc, dir, path,
					) => [
						...acc,
						{
							src: path,
							dest: `${ targetPath }/src/${ dir }`,
							action: 'copy',
						},
					], [],
				),
			],
		},
	};
};

const readDir = (context) => {
	const { read } = context;

	return {
		...context,
		...reduce(
			read, (
				acc, path, key,
			) => ({
				...acc,
				[key]: tranformPath(readFile(path), key),
			}), context,
		),
	};
};

module.exports = {
	properCase,
	camelCase,
	renderTemplates,
	write,
	copyCustomization,
	readDir,
};
