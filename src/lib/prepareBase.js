const { ensureTarget } = require('./repoManager');

const prepareBase = async (context) => {
	const { targetPath } = context;

	await ensureTarget({
		...context,
		localPath: targetPath,
	});
};

module.exports = prepareBase;
