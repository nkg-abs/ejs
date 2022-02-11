const simpleGit = require('simple-git');

const gitManager = ({ config }) => {
	const { name, sourceUrl, repo: { url: destinationUrl }, path } = config;
	const git = simpleGit(path || '');

	return {
		clone: async () => await git.clone(sourceUrl, `./dist/${ name }`),
		setRemote: async () => await git.remote('set-url', 'origin', destinationUrl),
		add: async (files) => await git.add(files),
		commit: async (message) => await git.commit(message),
	};
};

module.exports = gitManager;
