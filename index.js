/* eslint-disable no-await-in-loop */
const {
	read, processTemplate, buildContext, normalizeContent,
	buildContent,
} = require('./src/lib/repoManager');
const saveCode = require('./src/lib/saveCode');

const asyncReduce = async (collection, acc) => {
	while(collection.length)
		// eslint-disable-next-line no-param-reassign
		acc = await collection.shift()(acc);

	return acc;
};

const render = async (initial) => {
	const context = await read({
		...await buildContext(initial),
		localPath: 'dist/source',
	});
	const methods = [normalizeContent, buildContent, processTemplate, saveCode];

	await asyncReduce(methods, context);
};

render({});
