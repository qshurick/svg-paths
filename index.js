const readline = require('readline');
const { fixBoth } = require('./src/main');

const terminal = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
});

const paths = [];

console.log('Enter the first path:');

terminal.on('line', line => {
    paths.push(line);
    if (paths.length == 2) {
        const adjustedPaths = fixBoth(...paths);
        console.log();
        console.log('Adjust your paths accordingly:');
        console.log('-----');
        console.log(adjustedPaths[0]);
        console.log('-----');
        console.log(adjustedPaths[1]);
        console.log('-----');

        process.exit();
    } else {
        console.log('Enter the second path:');
    }
});
