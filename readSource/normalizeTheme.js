const normalizeTheme = (context) => {
	const { theme } = context;

	return {
		...context,
		theme: theme || 'default',
	};
};

module.exports = normalizeTheme;
