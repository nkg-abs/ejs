const simpleGit = require('simple-git');

const git = simpleGit();
const gitManager = ({name, sourceUrl, destinationUrl}) => ({
	clone: async () => await git.clone(sourceUrl, name),
	remote: async () => await git.remote('set-url', 'origin', destinationUrl),
});

module.exports = gitManager;
