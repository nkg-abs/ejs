const simpleGit = require('simple-git');
const { existsSync } = require('fs');

const gitManager = (context) => {
	const { config: { name, target }, path, source, localPath } = context;
	const git = simpleGit(path || '');

	return {
		clone: async () => await existsSync(localPath) || await git.clone(source, localPath),
		setRemote: async () => await git.remote('set-url', 'origin', target),
		add: async (files) => await git.add(files),
		commit: async (message) => await git.commit(message),
		log: async (commands = []) => await git.log(...commands),
		setConfig: async (config) => await git.addConfig(...config),
	};
};

module.exports = gitManager;
