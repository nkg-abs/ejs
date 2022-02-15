const { read, processTemplate, buildContext } = require('./src/lib/repoManager');

const render = async () => {
	await read();

	const context = await buildContext();

	await processTemplate(context);
};

render();
