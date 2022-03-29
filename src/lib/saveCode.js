const gitManager = require('./gitManager');
const shell = require('shelljs');
const { reduce, map } = require('@laufire/utils/collection');
const { existsSync, mkdirSync } = require('fs');
const { write } = require('../lib/templateManager');

const saveCode = {
	writeCode: ({ config: { content }}) =>
		map(content, ({ path, output}) => {
			const parentPath = path.replace(/\/index.js/, '');

			const ensureParent = () => {
				mkdirSync(parentPath);
				write(`${ parentPath }/index.js`, output);
			};

			existsSync(parentPath) || ensureParent();
		}),

	commitCode: async (context) => {
		const { details: { email, name, message }} = context;
		const { config: { name: repo }} = context;
		const { add, commit, setConfig } = gitManager(`dist/${ repo }`);

		await setConfig(['user.email', email]);
		await setConfig(['user.name', name]);
		await add(['.']);
		await commit(message);
	},

	processCode: async (context) => {
		saveCode.writeCode(context);
		await saveCode.commitCode(context);
	},
}

module.exports = saveCode;
