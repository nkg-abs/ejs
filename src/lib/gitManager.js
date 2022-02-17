const simpleGit = require('simple-git');

const gitManager = ({ config: { target } = {}, source, localPath }) => {
	const git = simpleGit(localPath);

	return {
		clone: async (path = localPath) => await git.clone(source, path),
		setRemote: async () => await git.remote(
			['add', 'origin', target]
		),
		add: async (files) => await git.add(files),
		commit: async (message) => await git.commit(message),
		log: async (commands = []) => await git.log(...commands),
		setConfig: async (config) => await git.addConfig(...config),
	};
};

module.exports = gitManager;
