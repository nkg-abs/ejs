const { existsSync, mkdirSync } = require('fs');
const { map } = require('@laufire/utils/collection');
const { write } = require('../src/lib/templateManager');

const writeCode = (context) => {
	const { config: { content }} = context;

	map(content, ({ path, output, fileName }) => {
		existsSync(path) || mkdirSync(path);
		write(`${ path }/${ fileName }`, output);
	});

	return context;
};

module.exports = writeCode;
