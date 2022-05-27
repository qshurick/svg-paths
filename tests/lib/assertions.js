class TestFailedException extends Error {}
class NoAssertionsException extends Error {}

let assertionsCount = 0;

function assertEquals(expected, actual, message) {
    assertionsCount++;
    if (expected !== actual) {
        throw new TestFailedException(message);
    }
}

function assertContains(match, actual, message) {
    assertionsCount++;
    if (!Array.isArray(actual)) {
        throw new TestFailedException('Excpect to have array: ' + message);
    }

    if (!actual.some(match)) {
        throw new TestFailedException(message);
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
