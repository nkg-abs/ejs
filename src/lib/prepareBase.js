const gitManager = require('./gitManager');
const shell = require('shelljs');

const prepareBase = async ({ config }) => {
	const { clone, setRemote } = gitManager(config);

	await clone();

	shell.exec(`sh ./dist/${config.name}/reset.sh`);

	await setRemote();
};

module.exports = prepareBase;
