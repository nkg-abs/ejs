const { existsSync, mkdirSync } = require('fs');
const { map } = require('@laufire/utils/collection');
const { write } = require('../src/lib/templateManager');
const { copySync } = require('fs-extra');

const writeCode = (context) => {
	const { config: { content }} = context;
	const actions = {
		copy: ({ src, dest }) => copySync(src, dest),
		write: ({ path, output, fileName }) => {
			existsSync(path) || mkdirSync(path);
			write(`${ path }/${ fileName }`, output);
		},
	};

	map(content, (file) => {
		const { action } = file;

		actions[action](file);
	});

	return context;
};

module.exports = writeCode;
