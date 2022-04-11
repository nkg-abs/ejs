
const { map, keys } = require('@laufire/utils/collection');
const asyncReduce = require('../src/lib/helpers');
const {
	properCase, hasChildren, usesContext,
} = require('../src/lib/templateManager');
const normalizeContent = require('./normalizeContent');
const buildContent = require('./buildContent');
const read = require('./read');

const buildContext = (context) => ({
	...context,
	localPath: 'dist/source',
	lib: { map, properCase, keys, hasChildren, usesContext },
});

const readSource = (context) => asyncReduce([
	buildContext,
	read,
	normalizeContent,
	buildContent,
], context);

module.exports = readSource;
