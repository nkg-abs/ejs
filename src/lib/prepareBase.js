const gitManager = require('./gitManager');
const shell = require('shelljs');
const { existsSync } = require('fs');

const prepareBase = async (context) => {
	const { config: { name }} = context;
	const target = `dist/${ name }`;
	const { clone, setRemote } = gitManager({
		...context,
		localPath: '',
	});

	existsSync(target) || await clone(target);

	shell.exec(`sh ./${ target }/reset.sh`);

	await setRemote();
};

module.exports = prepareBase;
