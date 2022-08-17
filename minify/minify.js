const minify = require('minify');
const options = require('./minify-options.json');
const fs = require('fs');

console.log(process.argv);
if (process.argv.length < 4) {
    console.error('requires 2 parameters: input file and output file');
    process.exit(1);
}

const inputFile = process.argv[2];
const outputFile = process.argv[3];

minify(inputFile, options)
    .then((minified) => {
        fs.writeFileSync(outputFile, minified);
        console.log(`Minified file saved: ${outputFile}`);
        process.exit(0);
    })
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });