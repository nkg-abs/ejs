const simpleGit = require('simple-git');

const gitManager = (context) => {
	const { config: { name, target }, path, source } = context;
	const git = simpleGit(path || '');

	return {
		clone: async () => await git.clone(source, `./dist/${ name }`),
		setRemote: async () => await git.remote('set-url', 'origin', target),
		add: async (files) => await git.add(files),
		commit: async (message) => await git.commit(message),
	};
};

module.exports = gitManager;
