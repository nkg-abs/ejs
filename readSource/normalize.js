const { asyncReduce } = require('../src/lib/helpers');
const normalizeContent = require('./normalizeContent');
const normalizeTheme = require('./normalizeTheme');

const normalize = (context) => asyncReduce([
	normalizeTheme,
	normalizeContent,
], context);

module.exports = normalize;
