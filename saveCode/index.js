const writeCode = require('./writeCode');
const commitCode = require('./commitCode');
const prepareBase = require('../src/lib/prepareBase');

const saveCode = async (context) => {
	await prepareBase(context);
	await writeCode(context);
	await commitCode(context);
};

module.exports = saveCode;
