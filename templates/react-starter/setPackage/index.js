const { read } = require('../../../src/lib/templateManager');

const appendContent = (context) => {
	const { data, config: { content }, config } = context;

	return {
		...context,
		config: {
			...config,
			content: [
				...content,
				data,
			],
		},
	};
};


const writePackage = ({ name, package, data }) => ({
	...package,
	[name]: {
		...package[name],
		...data,
	},
});

const buildPackage = (context) => {
	const { modules, config, targetPath } = context;
	const { theme, dependencies: packages } = config;
	const { name, version } = modules[theme];
	const packageConfig = JSON.parse(read({ ...context, data: `./${ targetPath }/package.json`}));

	return writePackage({
		name: 'dependencies',
		package: packageConfig,
		data: {
			...packages,
			[name]: version,
		},
	});
};

const setPackage = (context) => {
	const { targetPath } = context;
	const indentation = 2;

	return appendContent({
		...context,
		data: {
			path: `./${ targetPath }`,
			output: JSON.stringify(
				buildPackage(context), null, indentation,
			),
			fileName: 'package.json',
			action: 'write',
		},
	});
};

module.exports = setPackage;
