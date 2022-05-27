const readline = require('readline');
const { fixBoth } = require('./src/main');

const stuff = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
});

const paths = [];

stuff.on('line', line => {
    paths.push(line);
    if (paths.length == 2) {
        const adjustedPaths = fixBoth(...paths);
        console.log();
        console.log('Adjust your paths accordingly:');
        console.log(adjustedPaths[0]);
        console.log(adjustedPaths[1]);

        process.exit();
    }
});
