const gitManager = require('../src/lib/gitManager');

const commitCode = async (context) => {
	const { details: { email, name, message }} = context;
	const { targetPath } = context;
	const { add, commit, setConfig } = gitManager(targetPath);

	await setConfig(['user.email', email]);
	await setConfig(['user.name', name]);
	await add(['.']);
	await commit(message);

	return context;
};

module.exports = commitCode;
