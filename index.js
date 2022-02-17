const {
	read, processTemplate, buildContext,
} = require('./src/lib/repoManager');
const saveCode = require('./src/lib/saveCode');

const render = async (initial) => {
	const context = await read({
		...await buildContext(initial),
		source: 'git@github.com:nkg-laufire/simpleUI.git',
		localPath: 'dist/source',
	});

	await processTemplate(context);

	await saveCode(context);
};

render({});
