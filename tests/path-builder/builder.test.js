const { describe, it, assert } = require('../lib');
const { buildPath } = require('../../src/path-builder/builder');

describe('SVG Path builder', () => {
    it('should build path from list of tokens', () => {
        const tokens = [
            { token: 'm', params: '0 0'},
            { token: 'l', params: '100 100'},
            { token: 'l', params: '-100 100'},
            { token: 'z', params: ''},
        ];

        assert.equals('m 0 0 l 100 100 l -100 100 z', buildPath(tokens));
    });
});
