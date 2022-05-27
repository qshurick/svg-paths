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

module.exports  = {
    getTokens
};
