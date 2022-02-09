const simpleGit = require('simple-git');

const git = simpleGit();
const gitManager = ({ name, sourceUrl, repo: { url: destinationUrl } }) => ({
	clone: async () => await git.clone(sourceUrl, `./dist/${ name }`),
	setRemote: async () => await git.remote('set-url', 'origin', destinationUrl),
});

module.exports = gitManager;
