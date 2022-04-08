const { renderTemplates } = require('../src/lib/templateManager');
const getTemplates = require('../templates/react-starter');

const processTemplate = (context) => {
	const { config: { template }} = context;
	const { source } = require(`../templates/${ template }/config`);

	return renderTemplates({ ...getTemplates(context), source });
};

module.exports = processTemplate;
