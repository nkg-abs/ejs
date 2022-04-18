const config = {
	source: 'git@github.com:nkg-laufire/react-starter.git',
	modules: {
		material: {
			version: '4.12.4',
			name: '@material-ui/core',
			imports: {
				box: 'material-ui/core/Button',
			},
		},
		default: {},
	},
};

module.exports = config;
