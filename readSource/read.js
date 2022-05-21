const gitManager = require('../src/lib/gitManager');
const { reduce } = require('@laufire/utils/collection');

const read = async (context) => {
	const { localPath } = context;
	const { log } = gitManager(localPath);
	const { latest } = await log();
	const details = reduce(
		latest, (
			acc, value, key,
		) => ({ ...acc, [key.slice(key.indexOf('_') + 1)]: value }), {},
	);
	const config = require(`../${ localPath }/config`);
	const { name } = config;
	const targetPath = `../${ name }`;

	return { ...context, config, details, targetPath };
};

module.exports = read;
