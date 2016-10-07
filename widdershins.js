var fs = require('fs');
var path = require('path');

var yaml = require('js-yaml');

var converter = require('./index.js');

var argv = require('yargs')
    .usage('widdershins [options] {input-spec} [output markdown]')
    .demand(1)
    .strict()
    .boolean('yaml')
    .alias('y','yaml')
    .describe('yaml','Load spec in yaml format, default json')
    .boolean('code')
    .alias('c','code')
    .describe('code','Turn code samples off')
    .boolean('lang')
    .alias('l','lang')
    .describe('lang','Automatically generate list of languages for code samples')
    .help('h')
    .alias('h', 'help')
    .version(function() {
        return require('./package.json').version;
    })
    .argv;

var swagger = {};
if (argv.yaml) {
    var s = fs.readFileSync(path.resolve(argv._[0]),'utf8');
    swagger = yaml.safeLoad(s);
}
else {
    swagger = require(path.resolve(argv._[0]));
}

var options = {};
options.codeSamples = !argv.code;
if (argv.lang) options.language_tabs = [];

var output = converter.convert(swagger,options);

if (argv._.length>1) {
    fs.writeFileSync(path.resolve(argv._[1]),output,'utf8');
}
else {
    console.log(output);
}