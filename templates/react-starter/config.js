const config = {
	source: 'git@github.com:nkg-laufire/react-starter.git',
	modules: {
		material: {
			version: '4.12.4',
			name: '@material-ui/core',
			componentType: 'class',
			imports: {
				box: '@material-ui/core/Box',
				button: '@material-ui/core/Button',
			},
		},
		default: {},
	},
	read: {
		services: 'services',
		components: 'components',
	},
};

module.exports = config;
