const { describe, it, assert } = require('./lib');
const { getSignature } = require('../src/main');

describe('SVG main features', () => {

    it('should create correct signature with non repeating coomand', () => {
        const path = 'M 100,200 L 200,200 L 200,100 Z'
        const signature = getSignature(path);

        assert.equals('MLLZ', signature);
    });

});
