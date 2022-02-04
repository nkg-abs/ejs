const ejs = require('ejs');
const fs = require('fs');
const config = require('./config');

const { collection: { map }} = require('@laufire/utils');
const { App } = config;

const generate = (
	inputFile, data, outputFile
) => {
	ejs.renderFile(
		`${ inputFile }.ejs`, data, (err, output) => {
			fs.writeFile(
				`dist/${ outputFile }.js`, output, (fsErr) => {
					if(fsErr)
						throw fsErr;
				}
			);
		}
	);
};

map(App, (component) => {
	const { name } = component;

	generate(
		'button', component, name
	);
});

generate(
	'app', { App, map }, 'app'
);
