const { map } = require('@laufire/utils/collection');

const getContent = (content) =>
	map(content, ({ content: childContent, data }) =>
		(childContent ? getContent(childContent) : data));

const buildSeed = (context) => {
	const { config: { content }, config } = context;

	return {
		...context,
		config: {
			...config,
			seed: getContent(content),
		},
	};
};

module.exports = buildSeed;
