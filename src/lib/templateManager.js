const { renderFile } = require('ejs');
const { promises: { writeFile } } = require('fs');

const templateManager = ({ inputFile, data, outputFile }) => {
	const fileOperations = {
		write: async (output) => await writeFile(outputFile, output),
		compile: async () => await renderFile(inputFile, data),
		readAndWrite: async () => {
			const output = await fileOperations.compile();
			await fileOperations.write(output);
		},
	};

	return fileOperations;
};

module.export = templateManager;


