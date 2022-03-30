const { existsSync, mkdirSync } = require('fs');
const { map } = require('@laufire/utils/collection');
const { write } = require('../templateManager');

const writeCode = ({ config: { content }}) =>
		map(content, ({ path, output }) => {
			const parentPath = path.replace(/\/index.js/, '');

			const ensureParent = () => {
				mkdirSync(parentPath);
				write(`${ parentPath }/index.js`, output);
			};

			existsSync(parentPath) || ensureParent();
	});

module.exports = writeCode;
