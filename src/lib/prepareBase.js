const { mkdir } = require('shelljs');
const { existsSync } = require('fs');
const gitManager = require('./gitManager');

const createBase = async (context) => {
	const { targetPath, source } = context;

	mkdir(targetPath);
	const { init, setRemote, pull } = gitManager(targetPath);

	await init();
	await setRemote(['add', 'origin', source]);
	await pull(['origin', 'master']);
};

const prepareBase = async (context) => {
	const { targetPath } = context;

	existsSync(targetPath) || await createBase(context);

	return context;
};

module.exports = prepareBase;
