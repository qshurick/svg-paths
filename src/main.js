const commands = [
    'm', 'M',
    'l', 'L',
    'h', 'H',
    'v', 'V',
    'c', 'C',
    's', 'S',
    'q', 'Q',
    't', 'T',
    'a', 'A',
    'z', 'Z',
];

function getTokens(path) {
    const tokens = [];
    let params = [];
    let token = '';
    
    path.split('').map(ch => {
        if (commands.includes(ch)) {
            if (token !== '') {
                tokens.push({ token, params: params.join('') });
            }
            token = ch;
            params = [];
        } else {
            params.push(ch);
        }
    });

    if (token !== '') {
        tokens.push({ token, params: params.join('') });
    }

    return tokens;
}

function getSignature(path) {
    const tokens = getTokens(path);
    const signature = tokens.map(({ token }) => token).join('');

    return signature;
}

function buildZeroToken(command, previousPoint) {
    switch (command) {
        case 'l':
            return { token: command, params: '0 0' };
        case 'L':
            return { token: command, params: [previousPoint.x, previousPoint.y].join(' ')};
        case 'h':
        case 'v':
            return { token: command, params: '0' };
        case 'H':
            return { token: command, params: previousPoint.y };
        case 'V':
            return { token: command, params: previousPoint.x };
        case 'c':
            return { token: command, params: '0 0 0 0 0 0' };
        case 'C':
            return { token: command, params: [previousPoint.x, previousPoint.y, previousPoint.x, previousPoint.y, previousPoint.x, previousPoint.y].join(' ')};
        case 's':
            return { token: command, params: '0 0 0 0' };
        case 'S':
            return { token: command, params: [previousPoint.x, previousPoint.y, previousPoint.x, previousPoint.y].join(' ')};
        case 'q':
            return { token: command, params: '0 0 0 0' };
        case 'Q':
            return { token: command, params: [previousPoint.x, previousPoint.y, previousPoint.x, previousPoint.y].join(' ')};
        case 't':
            return { token: command, params: '0,0' };
        case 'T':
            return { token: command, params: [previousPoint.x, previousPoint.y].join(' ')};
        case 'a':
            return { token: command, params: '0 0 0 0,0 0 0' };
        case 'A':
            return { token: command, params: `0 0 0 0,0 ${previousPoint.x} ${previousPoint.y}`};
        default:
            throw new Error(`Unknow command ${command}`);
    }
}

function formatPath(path) {
    return path
        .replace(/([MLHVCSQTAZ])/g, ' $1')
        .trim()
        .replace(/\s\s+/g,' ');
}

function buildPath(tokens) {
    return formatPath(tokens.reduce((path, { token, params }) => `${path} ${token} ${params}`, ''));
}

function fixBoth(pathA, pathB) {
    const originalTokensA = getTokens(pathA);
    const originalTokensB = getTokens(pathB);

    const adjustedTokensA = [];
    const adjustedTokensB = [];

    let mergeToA = originalTokensB.length >= originalTokensA.length;

    let previousPointA = { x: null, y: null }, previousPointB = { x: null, y: null };
    let indexA = 0, indexB = 0;
    let attemptsLeft = originalTokensA.length + originalTokensB.length;

    while (attemptsLeft > 0) {
        const tokenA = originalTokensA[indexA];
        const tokenB = originalTokensB[indexB];

        if (tokenA.token === tokenB.token) {
            adjustedTokensA.push(tokenA);
            adjustedTokensB.push(tokenB);

            indexA++;
            indexB++;
        } else {
            if (mergeToA) {
                adjustedTokensA.push(buildZeroToken(tokenB.token, previousPointA));
                adjustedTokensB.push(tokenB);
                indexB++;
            } else {
                adjustedTokensA.push(tokenA);
                adjustedTokensB.push(buildZeroToken(tokenA.token, previousPointB));
                indexA++;
            }
        }

        if ((indexA >= originalTokensA.length - 1) && !mergeToA) {
            mergeToA = !mergeToA;
        } else if ((indexB >= originalTokensB.length - 1) && mergeToA) {
            mergeToA = !mergeToA;
        }

        if (indexA >= originalTokensA.length && indexB >= originalTokensB.length) {
            break;
        }

        attemptsLeft--;
    }

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
