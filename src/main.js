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
