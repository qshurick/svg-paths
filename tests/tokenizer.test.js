const { describe, it } = require('./lib/testRunner');
const { assert } = require('./lib/assertions');
const { getTokens, getSignature, fixBoth, formatPath } = require('../src/main');

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

    it('should create correct signature with non repeating coomand', () => {
        const path = 'M 100,200 L 200,200 L 200,100 Z'
        const signature = getSignature(path);

        assert.equals('MLLZ', signature);
    });

    it('should return same paths when no adjustment needed', () => {
        const pathA = 'M 100 100 L 50 50 Q 120 120 100 100Z';
        const pathB = 'M 10 10 L 500 500 Q 12 12 100 100Z';

        const [adjustedPathA, adjustedPathB] = fixBoth(pathA, pathB);

        assert.equals(getSignature(adjustedPathA), getSignature(adjustedPathB));
        assert.equals(formatPath(pathA), adjustedPathA);
        assert.equals(formatPath(pathB), adjustedPathB);
    });

    it('should add zero tokens to match the paths', () => {
        const pathA = 'm 0 0 l 100 100 l 200 200 z';
        const pathB = 'm 100 100 c 50 50 100 100 200 200 z';

        const [adjustedPathA, adjustedPathB] = fixBoth(pathA, pathB);

        assert.equals(getSignature(adjustedPathA), getSignature(adjustedPathB));
        assert.equals('m 0 0 l 100 100 l 200 200 c 0 0 0 0 0 0 z', adjustedPathA);
        assert.equals('m 100 100 l 0 0 l 0 0 c 50 50 100 100 200 200 z', adjustedPathB);
    });
});
