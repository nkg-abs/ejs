const simpleGit = require('simple-git');

const git = simpleGit();
const gitManager = (localPath, url, destinationUrl) => ({
	clone: async () => await git.clone(url, localPath),
	remote: async () => await git.remote('set-url', 'origin', destinationUrl),
});

module.exports = gitManager;
