
const { map, keys } = require('@laufire/utils/collection');
const { isIterable } = require('@laufire/utils/reflection');
const asyncReduce = require('../src/lib/helpers');
const { properCase } = require('../src/lib/templateManager');
const normalizeContent = require('./normalizeContent');
const buildContent = require('./buildContent');
const read = require('./read');

const buildContext = (context) => ({
	...context,
	localPath: 'dist/source',
	lib: { map, properCase, keys, isIterable },
});

const readSource = (context) => asyncReduce([
	buildContext,
	read,
	normalizeContent,
	buildContent,
], context);

module.exports = readSource;
