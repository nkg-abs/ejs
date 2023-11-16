const { reduce, result } = require('@laufire/utils/collection');
const { isIterable } = require('@laufire/utils/reflection');

const getContent = (content) => reduce(
	content, (
		acc, { content: childContent, data, type }, name, coll,
	) => ({
		...acc,
		...type !== 'simple' && {
			[name]: isIterable(childContent)
				? getContent(childContent)
				: result(coll, `${ data }/data`),
		},
	}), {},
);

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
