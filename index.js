const {
	read, processTemplate, buildContext, normalizeContent,
	buildContent,
} = require('./src/lib/repoManager');
const saveCode = require('./src/lib/saveCode');
const asyncReduce = require('./src/lib/helpers');

const render = async (initial) => {
	const context = await read({
		...await buildContext(initial),
		localPath: 'dist/source',
	});
	const methods = [normalizeContent, buildContent, processTemplate, saveCode];

	await asyncReduce(methods, context);
};

render({});
