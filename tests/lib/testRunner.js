const { TestFailedException, NoAssertionsException, resetAssertions, getAssertionsCount } = require('./assertions');

const testPlan = {};
const GLOBAL_TEST_SUITE = 'default';
let currentTestSuite = null;

testPlan[GLOBAL_TEST_SUITE] = {};

function describe(testSuiteName, testSuite) {
    currentTestSuite = testSuiteName;

    testPlan[currentTestSuite] = {};

    testSuite();
}

function it(testName, testFunction) {
    testPlan[currentTestSuite][testName] = testFunction;
}

function run() {
    const report = {
        total: 0,
        run: 0,
        assertions: 0,
        failed: [],
        errors: [],
        warnings: [],
    };
    console.log('running tests');
    Object.keys(testPlan).map(suiteName => {
        const total = Object.keys(testPlan[suiteName]).length;
        report.total += total;
        console.log(` * found ${total} tests in [${suiteName}]`);
        for (testName of Object.keys(testPlan[suiteName])) {
            const test = testPlan[suiteName][testName];
            try {
                resetAssertions();
                test();
                if (getAssertionsCount() === 0) {
                    report.warnings.push({
                        suite: suiteName,
                        test: testName,
                        error: new NoAssertionsException(),
                    });
                }
            } catch (error) {
                if (error instanceof TestFailedException) {
                    report.failed.push({
                        suite: suiteName,
                        test: testName,
                        error,
                    });
                } else {
                    report.errors.push({
                        suite: suiteName,
                        test: testName,
                        error,
                    });
                }
            } finally {
                report.run++;
                report.assertions += getAssertionsCount();
            }
        }
    });
    console.log('done');
    console.dir(report);
}

module.exports = {
    describe,
    it,
    run,
};
