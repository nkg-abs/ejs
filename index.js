const ejs = require('ejs');
const fs = require('fs');
const config = require('./config')

const { App } = config;
const exportData = (fileName, output) => fs.writeFile(`dist/${fileName}.js`, output, (err) => {
    if (err) throw err;
});

App.map((component) => {
    const { name } = component;
    ejs.renderFile('component.ejs', component, (err, output) => {
        exportData(name, output)
    });
});

ejs.renderFile('app.ejs', config, (err, output) => {
    exportData('app', output)
});



