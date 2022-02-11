const gitManager = require('./gitManager');
const shell = require('shelljs');

const prepareBase = async (context) => {
	const { config: { name }} = context;
	const { clone, setRemote } = gitManager(context);

	await clone();

	shell.exec(`sh ./dist/${ name }/reset.sh`);

	await setRemote();
};

module.exports = prepareBase;
