/**
 * One point fixer is a strategy to fix a path by adding command to generate
 * a single point to ensure the possibility of the straign transition between
 * two SVG paths
 **/

function buildZeroToken(command) {
    switch (command) {
        case 'l':
        case 'L':
            return { token: 'l', params: '0 0' };
        case 'h':
        case 'v':
        case 'H':
        case 'V':
            return { token: command.toLowerCase(), params: '0' };
        case 'c':
        case 'C':
            return { token: 'c', params: '0 0 0 0 0 0' };
        case 's':
        case 'S':
            return { token: 's', params: '0 0 0 0' };
        case 'q':
        case 'Q':
            return { token: 'q', params: '0 0 0 0' };
        case 't':
        case 'T':
            return { token: 't', params: '0,0' };
        case 'a':
        case 'A':
            return { token: 'a', params: '0 0 0 0,0 0 0' };
        default:
            throw new Error(`Unknow command ${command}`);
    }
}

function fix(originalTokensA, originalTokensB) {
    const adjustedTokensA = [];
    const adjustedTokensB = [];

    let mergeToA = originalTokensB.length >= originalTokensA.length;

    let indexA = 0, indexB = 0;
    let attemptsLeft = originalTokensA.length + originalTokensB.length;

    while (attemptsLeft > 0) {
        const tokenA = originalTokensA[indexA];
        const tokenB = originalTokensB[indexB];


        if (tokenA.token.toLowerCase() === tokenB.token.toLowerCase()) {
            adjustedTokensA.push(tokenA);
            adjustedTokensB.push(tokenB);

            indexA++;
            indexB++;
        } else {
            if (mergeToA) {
                adjustedTokensA.push(buildZeroToken(tokenB.token));
                adjustedTokensB.push(tokenB);
                indexB++;
            } else {
                adjustedTokensA.push(tokenA);
                adjustedTokensB.push(buildZeroToken(tokenA.token));
                indexA++;
            }
            mergeToA = !mergeToA;
        }

        if ((indexA >= originalTokensA.length - 1) && !mergeToA) {
            mergeToA = true;
        } else if ((indexB >= originalTokensB.length - 1) && mergeToA) {
            mergeToA = false;
        }

        if (indexA >= originalTokensA.length && indexB >= originalTokensB.length) {
            break;
        }

        attemptsLeft--;
    }

    return [
        adjustedTokensA,
        adjustedTokensB,
    ];
}

module.exports = {
    fix,
}
