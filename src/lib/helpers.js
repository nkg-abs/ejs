const { Glob } = require('glob');

const readFile = (path) => {
	const { found } = new Glob(`${ path }/**/*.js`, { mark: true, sync: true });

	return found;
};

const tranformPath = (coll, value) =>
	coll.map((path) => path.replace(`${ value }/`, ''));

/* eslint-disable no-param-reassign */
const asyncReduce = async (collection, acc) => {
	while(collection.length)
		// eslint-disable-next-line no-await-in-loop
		acc = await collection.shift()(acc);

	return acc;
};

module.exports = { asyncReduce, readFile, tranformPath };
