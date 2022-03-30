const { ensureTarget, resetTarget } = require('./repoManager');

const prepareBase = async (context) => {
	const { targetPath } = context;

	await ensureTarget({
		...context,
		localPath: targetPath,
	});

	resetTarget(context);
};

module.exports = prepareBase;
