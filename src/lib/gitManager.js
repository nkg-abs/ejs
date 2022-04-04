const simpleGit = require('simple-git');

const gitManager = (localPath) => {
	const git = simpleGit(localPath);

	return {
		clone: ({ source, localPath: path }) => git.clone(source, path),
		setRemote: (commands) => git.remote(commands),
		add: (files) => git.add(files),
		commit: (message) => git.commit(message),
		log: (commands = []) => git.log(...commands),
		setConfig: (config) => git.addConfig(...config),
		init: () => git.init(),
		pull: (commands) => git.pull(...commands),
	};
};

module.exports = gitManager;
