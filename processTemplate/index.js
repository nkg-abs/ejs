const processTemplate = (context) => {
	const { config: { template }} = context;
	const init = require(`../templates/${ template }/index`);

	return init(context);
};

module.exports = processTemplate;
