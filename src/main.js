const { getTokens } = require('./tokenizer/tokenizer');
const { fix } = require('./fixer/one-point-fixer');
const { buildPath } = require('./path-builder/builder');

function getSignature(path) {
    const tokens = getTokens(path);
    const signature = tokens.map(({ token }) => token).join('');

    return signature;
}

function formatPath(path) {
    return buildPath(getTokens(path));
}

function fixBoth(pathA, pathB) {
    const originalTokensA = getTokens(pathA);
    const originalTokensB = getTokens(pathB);

    const [adjustedTokensA, adjustedTokensB] = fix(originalTokensA, originalTokensB);

    return [
        buildPath(adjustedTokensA),
        buildPath(adjustedTokensB),
    ];
}

module.exports  = {
    getTokens,
    getSignature,
    fixBoth,
    formatPath,
};
