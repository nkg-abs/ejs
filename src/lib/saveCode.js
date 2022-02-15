const gitManager = require('./gitManager');

const saveCode = async (context) => {
	const { add, commit, setConfig } = gitManager(context);
	const { config: { details: { author_email, author_name, message }}} = context;

	await setConfig(['user.email', author_email]);
	await setConfig(['user.name', author_name]);
	await add(['.']);
	await commit(message);
};

module.exports = saveCode;
