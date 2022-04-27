const { readFileSync } = require('fs');

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

const readPackage = ({ targetPath }) =>
	JSON.parse(readFileSync(`./${ targetPath }/package.json`));

const writePackage = ({ name, package, data }) => ({
	...package,
	[name]: {
		...package[name],
		...data,
	},
});

const buildPackage = (context) => {
	const { modules, config: { theme, dependencies: packages }} = context;
	const { name, version } = modules[theme];
	const packageConfig = readPackage(context);

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
