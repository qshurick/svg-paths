function formatPath(path) {
    return path
        .replace(/([MLHVCSQTAZ])/g, ' $1')
        .trim()
        .replace(/\s\s+/g,' ');
}

function buildPath(tokens) {
    return formatPath(tokens.reduce((path, { token, params }) => `${path} ${token} ${params}`, ''));
}

module.exports = {
    buildPath,
}
