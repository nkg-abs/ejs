const {
	read, processTemplate, buildContext, normalizeContent,
	buildContent,
} = require('./src/lib/repoManager');
const saveCode = require('./src/lib/saveCode');

const render = async (initial) => {
	const context = await read({
		...await buildContext(initial),
		localPath: 'dist/source',
	});
	const normalized = normalizeContent(context);
	const build = buildContent(normalized);

	await processTemplate(build);

	await saveCode(build);
};

render({});
