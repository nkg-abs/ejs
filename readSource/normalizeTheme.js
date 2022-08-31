const normalizeTheme = (context) => ({
	...context,
	theme: context.theme || 'default',
});

module.exports = normalizeTheme;
