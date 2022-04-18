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

const setDependencies = (context) => {
	const { data: { package, module: { name, version }}} = context;
	const { dependencies } = package;

	return {
		...package,
		dependencies: {
			...dependencies,
			[name]: version,
		},
	};
};

const setPackage = (context) => {
	const { modules, targetPath, config: { theme }} = context;
	const packagePath = `./${ targetPath }/package.json`;
	const indentation = 2;

	const package = JSON.parse(readFileSync(packagePath));
	const updated = setDependencies({
		...context,
		data: { package: package, module: modules[theme] },
	});

	return appendContent({
		...context,
		data: {
			path: `./${ targetPath }`,
			output: JSON.stringify(
				updated, null, indentation,
			),
			fileName: 'package.json',
		},
	});
};

module.exports = setPackage;
