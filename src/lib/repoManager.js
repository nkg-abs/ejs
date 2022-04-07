const shell = require('shelljs');
const { existsSync } = require('fs');
const gitManager = require('./gitManager');

const repoManager = {
	ensureTarget: async (context) => {
		const { targetPath } = context;
		const createBase = async ({ source }) => {
			shell.mkdir(targetPath);

			const { init, setRemote, pull } = gitManager(targetPath);

			await init();
			await setRemote(['add', 'origin', source]);
			await pull(['origin', 'master']);
		};

		existsSync(targetPath) || await createBase(context);
	},

	resetTarget: ({ targetPath }) => shell.exec(`sh ./${ targetPath }/reset.sh`),
};

module.exports = repoManager;
