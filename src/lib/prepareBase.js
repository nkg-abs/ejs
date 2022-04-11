const { mkdir } = require('shelljs');
const { existsSync } = require('fs');
const gitManager = require('./gitManager');

const prepareBase = async (context) => {
	const { targetPath } = context;
	const createBase = async ({ source }) => {
		mkdir(targetPath);
		const { init, setRemote, pull } = gitManager(targetPath);

		await init();
		await setRemote(['add', 'origin', source]);
		await pull(['origin', 'master']);
	};

	existsSync(targetPath) || await createBase(context);

	return context;
};

module.exports = prepareBase;
