const config = require('./config');
const init = require(`./templates/${config.template}/index.js`);
const { map } = require('@laufire/utils/collection');
const { properCase } = require('./src/lib/templateManager');

init({ config: { ...config, lib: { map, properCase }}});
