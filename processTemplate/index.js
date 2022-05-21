const { asyncReduce } = require('../src/lib/helpers');
const prepareBase = require('../src/lib/prepareBase');
const {
	renderTemplates, copyCustomization, readDir,
	updateEntry,
} = require('../src/lib/templateManager');

const processTemplate = (context) => {
	const { config: { template }} = context;
	const appConfig = require(`../templates/${ template }/config`);
	const getTemplates = require(`../templates/${ template }`);
	const setPackage = require(`../templates/${ template }/setPackage`);

	return asyncReduce([
		prepareBase,
		readDir,
		getTemplates,
		renderTemplates,
		setPackage,
		copyCustomization,
		updateEntry,
	], { ...context, ...appConfig });
};

module.exports = processTemplate;
