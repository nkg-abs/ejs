
const { map } = require('@laufire/utils/collection');
const { asyncReduce } = require('../src/lib/helpers');
const {	properCase } = require('../src/lib/templateManager');
const normalize = require('./normalize');
const buildContent = require('./buildContent');
const read = require('./read');
const buildSeed = require('./buildSeed');

const buildContext = (context) => ({
	...context,
	localPath: 'dist/source' || process.argv[2],
	lib: { map, properCase },
});

const readSource = (context) => asyncReduce([
	buildContext,
	read,
	normalize,
	buildSeed,
	buildContent,
], context);

module.exports = readSource;
