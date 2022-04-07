const {	processTemplate } = require('./src/lib/repoManager');
const readSource = require('./readSource');
const saveCode = require('./saveCode');
const asyncReduce = require('./src/lib/helpers');

const render = (context) =>	asyncReduce([
	readSource,
	processTemplate,
	saveCode,
], context);

render({});
