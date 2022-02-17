const simpleGit = require('simple-git');
const { existsSync } = require('fs');

const gitManager = ({ config: { name, target } = {}, source, localPath }) => {
	const exists = existsSync(localPath);
	const git = simpleGit( exists ? localPath : '');

	return {
		clone: async () => exists || await git.clone(source, localPath),
		setRemote: async () => await git.remote(
			'set-url', 'origin', target,
		),
		add: async (files) => await git.add(files),
		commit: async (message) => await git.commit(message),
		log: async (commands = []) => await git.log(...commands),
		setConfig: async (config) => await git.addConfig(...config),
	};
};

module.exports = gitManager;
