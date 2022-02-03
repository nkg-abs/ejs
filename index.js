const ejs = require('ejs');
const fs = require('fs');
const data = require('./tpl.json');

ejs.renderFile('index.ejs', data, (err, output) => {
    fs.writeFile('output.js', output, (err) => {
        if (err) throw err;
    });
});


