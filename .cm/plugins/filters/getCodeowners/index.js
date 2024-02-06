/**
 * @module getCodeowners
 * @description Resolves the PR's code owners based on the repository's CODEOWNERS file
 * @param {string[]} files - the gitStream's files context variable
 * @param {Object} pr - the gitStream's pr context variable
 * @param {string} token - access token with repo:read scope, used to read the CODEOWNERS file
 * @param {string} pathToCodeOwners - path from repo root to CODEOWNERS file
 * @returns {string[]} user names
 * @example {{ files | getCodeowners(pr, env.CODEOWNERS_TOKEN, '.github/CODEOWNERS') }}
 **/

const { Octokit } = require("@octokit/rest");
const ignore = require('./ignore/index.js');

async function loadCodeownersFile(owner, repo, auth, pathToCodeOwners) {
    const octokit = new Octokit({
        request: { fetch },
        auth,
    });

    const res = await octokit.repos.getContent({
        owner,
        repo,
        path: pathToCodeOwners
    });

    return Buffer.from(res.data.content, 'base64').toString()
}
function codeownersMapping(data) {
    return data
        .toString()
        .split('\n')
        .filter(x => x && !x.startsWith('#'))
        .map(x => x.split("#")[0])
        .map(x => {
            const line = x.trim();
            const [path, ...owners] = line.split(/\s+/);
            return {path, owners};
        });
}

function resolveCodeowner(mapping, file) {
    const match = mapping
        .slice()
        .reverse()
        .find(x =>
            ignore()
                .add(x.path)
                .ignores(file)
        );
    if (!match) return false;
    return match.owners;
}

module.exports = {
    async: true,
    filter: async (files, pr, token, pathToCodeOwners, callback) => {
        const fileData = await loadCodeownersFile(pr.author, pr.repo, token, pathToCodeOwners);
        const mapping = codeownersMapping(fileData);

        const resolved = files
            .map(f => resolveCodeowner(mapping, f))
            .flat()
            .filter(i => typeof i === 'string')
            .filter(i => i.startsWith('@gradle'))
            .map(u => u.replace(/^@gradle\//, ""))

        const unique = [mapping];

        return callback(null, unique);
    },
}

// const ownersToAdditionalLabels = {
//     'bt-architecture-council': [],
//     'bt-build-scan': [],
//     'bt-configuration': [],
//     'bt-core-runtime-maintainers': [],
//     'bt-developer-productivity': [],
//     'bt-devrel-education': [],
//     'bt-execution': [],
//     'bt-extensibility-maintainers': [],
//     'bt-ge-build-cache': [],
//     'bt-jvm': [],
//     'bt-kotlin-dsl-maintainers': [],
//     'bt-ide-experience': [],
//     'bt-native-maintainers': [],
//     'bt-support': [],
//     'ge-build-insights': [],
//     'ge-testing': []
// }
