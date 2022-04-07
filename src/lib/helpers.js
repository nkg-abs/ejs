/* eslint-disable no-param-reassign */
const asyncReduce = async (collection, acc) => {
	while(collection.length)
		// eslint-disable-next-line no-await-in-loop
		acc = await collection.shift()(acc);

	return acc;
};

module.exports = asyncReduce;
