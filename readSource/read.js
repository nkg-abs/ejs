const gitManager = require('../src/lib/gitManager');
const { reduce } = require('@laufire/utils/collection');
const { asyncReduce } = require('../src/lib/helpers');

const getCommitDetails = async (context) => {
	const { localPath } = context;
	const { latest } = await gitManager(localPath).log();

	return {
		...context,
		details: reduce(latest, (
			acc, value, key,
		) => ({ ...acc, [key.slice(key.indexOf('_') + 1)]: value })),
	};
};

const getConfig = (context) => {
	const { localPath } = context;
	const config = require(`../${ localPath }/config`);

	return {
		...context,
		config: config,
		targetPath: `../${ config.name }`,
	};
};

const read = (context) => asyncReduce([
	getCommitDetails,
	getConfig,
], context);

module.exports = read;
