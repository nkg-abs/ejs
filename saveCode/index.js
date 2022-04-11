const writeCode = require('./writeCode');
const commitCode = require('./commitCode');
const prepareBase = require('../src/lib/prepareBase');
const asyncReduce = require('../src/lib/helpers');

const saveCode = (context) => asyncReduce([
	prepareBase,
	writeCode,
	commitCode,
], context);

module.exports = saveCode;
