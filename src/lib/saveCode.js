const gitManager = require('./gitManager');

const saveCode = async (context) => {
	const { config: { name }, details: { author_email, author_name, message }} = context;
	const { add, commit, setConfig } = gitManager({
		...context,
		localPath: `dist/${ name }`,
	});

	await setConfig(['user.email', author_email]);
	await setConfig(['user.name', author_name]);
	await add(['.']);
	await commit(message);
};

module.exports = saveCode;
