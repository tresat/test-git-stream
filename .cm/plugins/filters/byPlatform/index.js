/**
 * @module byPlatform
 * @description Groups the PR's code owners based on the repository's CODEOWNERS file
 * @param {string[]} files - the gitStream's files context variable
 * @returns {Map} - Map from platform to list of files in this PR in it
 * @example {{ owners | byPlatform }}
 */
function byPlatform(files) {
    const result = new Map();
    files.forEach(file => {
        const platform = getPlatform(file);
        if (!result.has(platform)) {
            result.set(platform, []);
        }
        result.get(platform).push(file);
    });

    console.log("byPlatform: ");
    [...result.keys()].forEach(platform => {
        console.log("[" + platform + ": [" + result.get(platform).join(", ") + "]]");
    });
    return result;
}

function getPlatform(file) {
    return 'Sample';
}

module.exports = byPlatform;
