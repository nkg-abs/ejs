const gitManager = require('./gitManager');
const shell = require('shelljs');
const { existsSync } = require('fs');

const prepareBase = async (context) => {
	const { config: { name }} = context;
	const target = `dist/${ name }`;
	const { clone } = gitManager({
		...context,
		localPath: '',
	});

	existsSync(target) || await clone(target);

	shell.exec(`sh ./${ target }/reset.sh`);

	const { setRemote } = gitManager({
		...context,
		localPath: target,
	});

	await setRemote();
};

module.exports = prepareBase;
