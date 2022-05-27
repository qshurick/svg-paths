class TestFailedException extends Error {}
class NoAssertionsException extends Error {}

let assertionsCount = 0;

function createFormattedMessage(message, expected, actual, assertion) {
    return `${assrtion}`;
}

function assertEquals(expected, actual, message) {
    assertionsCount++;
    if (expected !== actual) {
        throw new TestFailedException(
            message
                ? message
                : `Failed to assert that [${actual}] equals to [${expected}]`
        );
    }
}

function assertContains(match, actual, message) {
    assertionsCount++;
    if (!Array.isArray(actual)) {
        throw new TestFailedException(
            (message ? (message + ':') : '') +
            `Expected an array ${actual} got`
        );
    }

    if (!actual.some(match)) {
        throw new TestFailedException(
            message
                ? message
                : `Failed to assert that [${actual}] contains expected value with: ${match}`
        );
    }
}

const assert = {
    equals: assertEquals,
    contains: assertContains,
};

module.exports = {
    TestFailedException,
    NoAssertionsException,
    assert,
    resetAssertions: () => {
        assertionsCount = 0;
    },
    getAssertionsCount: () => {
        return assertionsCount;
    },
};
