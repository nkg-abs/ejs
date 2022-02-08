const config = require('./config');
const init = require(`./templates/${config.template}/index.js`);

init(config);
