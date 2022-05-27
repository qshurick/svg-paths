const { describe, it } = require('./lib/testRunner');
const { assert } = require('./lib/assertions');
const { getTokens } = require('../src/main');

const supportedCommands = {
    'Move to point with absolute coordinates': ['M 100 101', 'M'],
    'Line to point with absolute coordinates': ['L 100 110', 'L'],
    'Horizontal line to point with absolute coordinates': ['H 50', 'H'],
    'Vertical line to point with absolute coordinates': ['V -20', 'V'],
    'Curve line to point with absolute coordinates': ['C 10 10 60 60 20 20', 'C'],
    'Smooth curve line to point with absolute coordinates': ['S 60 60 20 20', 'S'],
    'Quardatic Bezier curve through point with absolute coordinates': ['Q 60 60 20 20', 'Q'],
    'Smooth quardatic Bezier curve through point with absolute coordinates': ['T 20 20', 'T'],
    'Elliptical arc with absoute coordinates': ['A 30 20 145 0 1 50 50', 'A'],
    'Move to point with relative coordinates': ['m 100 101', 'm'],
    'Line to point with relative coordinates': ['l 100 110', 'l'],
    'Horizontal line to point with relative coordinates': ['h 555', 'h'],
    'Vertical line to point with relative coordinates': ['v 666', 'v'],
    'Curve line to point with relative coordinates': ['c 10 10 60 60 20 20', 'c'],
    'Smooth curve line to point with relative coordinates': ['s 60 60 20 20', 's'],
    'Quardatic Bezier curve through point with relative coordinates': ['q 60 60 10 10', 'q'],
    'Smooth quardatic Bezier curve through point with relative coordinates': ['t 10 10', 't'],
    'Elliptical arc with absoute coordinates': ['a 50 50 90 0 1 40 40', 'a'],
    'Close path 1': ['Z', 'Z'],
    'Close path 2': ['z', 'z'],
};

describe('SVG Path tokenizer', () => {
    Object.keys(supportedCommands).map(testName => {
        it(`should support ${testName}`, () => {
            const [path, expectedToken] = supportedCommands[testName];
            const tokens = getTokens(path);
            assert.contains(token => token.token === expectedToken, tokens);
        });
    });
});
