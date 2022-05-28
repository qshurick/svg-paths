const { run } = require('./lib/testRunner');

// require('./dummy.test.js');

require('./main.test.js');
require('./tokenizer/tokenizer.test.js');
require('./fixer/one-point-fixer.test.js');
require('./path-builder/builder.test.js');

run();
