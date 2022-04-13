const { renderTemplates } = require('../src/lib/templateManager');

const processTemplate = (context) => {
	const { config: { template }} = context;
	const { source } = require(`../templates/${ template }/config`);
	const getTemplates = require(`../templates/${ template }`);

	return renderTemplates({ ...getTemplates(context), source });
};

module.exports = processTemplate;
