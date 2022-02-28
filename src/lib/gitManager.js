const simpleGit = require('simple-git');

const gitManager = (localPath) => {
	const git = simpleGit(localPath);

	return {
		clone: async ({ source, localPath: path }) =>
			await git.clone(source, path),
		setRemote: async (commands) =>
			await git.remote(commands),
		add: async (files) => await git.add(files),
		commit: async (message) => await git.commit(message),
		log: async (commands = []) => await git.log(...commands),
		setConfig: async (config) => await git.addConfig(...config),
	};
};

module.exports = gitManager;
