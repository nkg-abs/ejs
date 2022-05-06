const writeCode = require('./writeCode');
const commitCode = require('./commitCode');
const { asyncReduce } = require('../src/lib/helpers');

const saveCode = (context) => asyncReduce([
	writeCode,
	commitCode,
], context);

module.exports = saveCode;
