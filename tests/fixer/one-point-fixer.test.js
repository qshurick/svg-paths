const { describe, it, assert } = require('../lib');
const { getTokens } = require('../../src/main');
const { fix } = require('../../src/fixer/one-point-fixer');

describe('SVG one point fixer', () => {
    it('should return same paths when no adjustment needed', () => {
        const tokensA = getTokens('M 100 100 L 50 50 Q 120 120 100 100Z');
        const tokensB = getTokens('M 10 10 L 500 500 Q 12 12 100 100Z');

        const [adjustedTokensA, adjustedTokensB] = fix(tokensA, tokensB);

        assertSameTokensOrder(adjustedTokensA, adjustedTokensB);
        assertSameTokens(tokensA, adjustedTokensA);
        assertSameTokens(tokensB, adjustedTokensB);
    });

    it('should add zero tokens to match the paths', () => {
        const tokensA = getTokens('m 0 0 l 100 100 l 200 200 z');
        const tokensB = getTokens('m 100 100 c 50 50 100 100 200 200 z');

        const [adjustedTokensA, adjustedTokensB] = fix(tokensA, tokensB);

        assertSameTokensOrder(adjustedTokensA, adjustedTokensB);
    });

    it('should keep all original tokens when fix the path', () => {
        const tokensA = getTokens('m 0 0 l 100 100 l 200 200 z');
        const tokensB = getTokens('m 100 100 c 50 50 100 100 200 200 z');

        const [adjustedTokensA, adjustedTokensB] = fix(tokensA, tokensB);

        assertOnlyZeroTokensDiff(tokensA, adjustedTokensA);
        assertOnlyZeroTokensDiff(tokensB, adjustedTokensB);
    });

    function isZeroToken(token) {
        if (['m','M','z','Z'].includes(token.token)) {
            return false;
        }
        return /^[0, ]*$/.test(token.params);
    }

    function assertSameTokensOrder(expectedTokens, actualTokens) {
        assert.equals(expectedTokens.length, actualTokens.length);
        for (let index = 0; index < expectedTokens.length; index++) {
            assert.equals(expectedTokens[index].token.toLowerCase(), actualTokens[index].token.toLowerCase());
        }
    }

    function assertSameTokens(expectedTokens, actualTokens) {
        assert.equals(expectedTokens.length, actualTokens.length);
        for (let index = 0; index < expectedTokens.length; index++) {
            assertSameToken(expectedTokens[index], actualTokens[index]);
        }
    }

    function assertSameToken(expectedToken, actualToken) {
        assert.equals(expectedToken.token, actualToken.token);
        assert.equals(expectedToken.params, actualToken.params);
    }

    function assertOnlyZeroTokensDiff(expectedTokens, actualTokens) {
        let expectedIndex = 0, actualIndex = 0;
        while (expectedIndex < expectedTokens.length) {
            if (isZeroToken(actualTokens[actualIndex])) {
                actualIndex++;
                continue;
            }
            assertSameToken(expectedTokens[expectedIndex], actualTokens[actualIndex]);
            actualIndex++;
            expectedIndex++;
        }
    }
});
