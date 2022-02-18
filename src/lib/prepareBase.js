const gitManager = require('./gitManager');
const { ensureTarget, resetTarget } = require('./repoManager');

const prepareBase = async (context) => {
	const { targetPath } = context;

	await ensureTarget(context);

	resetTarget(context);

	const { setRemote } = gitManager({
		...context,
		localPath: targetPath,
	});

	await setRemote();
};

module.exports = prepareBase;
