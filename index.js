const config = require('./config');
const init = require(`./templates/${config.template}/index.js`);
const collection = require('@laufire/utils/collection');
const templateManager = require('./src/lib/templateManager');

const { reduce } = collection;
const actions = { ...collection, ...templateManager };
const lib = reduce(['map', 'properCase'], (acc, name) => ({
	...acc,
	[name]: actions[name],
}), {});

init({ config: { ...config, lib }});
