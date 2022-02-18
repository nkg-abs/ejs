const gitManager = require('./gitManager');

const saveCode = async (context) => {
	const { details: { email, name, message }} = context;
	const { config: { name: repo }} = context;
	const { add, commit, setConfig } = gitManager({
		...context,
		localPath: `dist/${ repo }`,
	});

	await setConfig(['user.email', email]);
	await setConfig(['user.name', name]);
	await add(['.']);
	await commit(message);
};

module.exports = saveCode;
