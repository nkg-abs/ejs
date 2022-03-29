const {
	read, processTemplate, buildContext, normalizeContent,
	buildContent,
} = require('./src/lib/repoManager');
const { processCode } = require('./src/lib/saveCode');

const render = async (initial) => {
	const context = await read({
		...await buildContext(initial),
		localPath: 'dist/source',
	});
	const normalized = normalizeContent(context);
	const built = buildContent(normalized);

	await processTemplate(built);

	await processCode(built);
};

render({});
