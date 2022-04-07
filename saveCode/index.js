const writeCode = require('./writeCode');
const commitCode = require('./commitCode');

const saveCode = async (context) => {
	writeCode(context);
	await commitCode(context);
};

module.exports = saveCode;
