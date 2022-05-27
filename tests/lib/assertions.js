class TestFailedException extends Error {}
class NoAssertionsException extends Error {}

let assertionsCount = 0;

function assertEquals(expected, actual, message) {
    assertionsCount++;
    if (expected !== actual) {
        throw new TestFailedException(message);
    }
}

const assert = {
    equals: assertEquals,
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
