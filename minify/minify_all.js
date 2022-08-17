const fs = require('fs');
const path = require('path');
const minify = require('minify');
const options = require('./minify-options.json');

const excluded = ['- new plugin template.js'];
const searchString = "//version = \"";

const pluginPath = '../src';

(async () => {
    const plugins = fs.readdirSync(pluginPath);
    const paths = plugins.filter(p => excluded.indexOf(p) === -1).map(p => path.join(pluginPath, p));
    for (let filePath of paths) {
        console.log(filePath);
        const content = fs.readFileSync(filePath, { encoding: 'utf8' });
        const versionIndex = content.indexOf(searchString);
		
        if (versionIndex === -1) {
            continue;
		}
		
        const versionText = content.slice(versionIndex + searchString.length, versionIndex + searchString.length + content.slice(versionIndex + searchString.length).indexOf("\"")).replace('V', '').trim();
        if(versionText.includes("UNRELEASED")) {
			continue;
		}

        let fileName = path.basename(filePath);
        fileName = fileName.slice(0, path.basename(filePath).length - 3);

        const pathTo = path.join('../versions/', `StructuredDataLibrary-${fileName}-${versionText}.min.js`);
		
        const minified = await minify(filePath, options);
        fs.writeFileSync(pathTo, minified, {flag: 'w'});
        console.log(`Minified file saved: ${pathTo}`);
    }

})();