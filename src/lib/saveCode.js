const gitManager = require('./gitManager');

const saveCode = async (context) => {
	const { add, commit } = gitManager(context);
	await add(['.']);
	await commit('Temp.');
};

module.exports = saveCode;
