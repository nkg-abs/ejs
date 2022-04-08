const writeCode = require('./writeCode');
const commitCode = require('./commitCode');
const prepareBase = require('../src/lib/prepareBase');

const saveCode = async (context) => {
	const { config: { template }} = context;
	const { source } = require(`../templates/${ template }/config`);

	await prepareBase({ ...context, source });
	await writeCode(context);
	await commitCode(context);
};

module.exports = saveCode;
