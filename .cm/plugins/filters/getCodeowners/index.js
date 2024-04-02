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

function resolveCodeowners(mapping, file) {
    const match = mapping
        .slice()
        .reverse()
        .find(x =>
            ignore()
                .add(x.path)
                .ignores(file)
        );
    if (!match) throw new Error("No codeowner found for ${file}");
    return match.owners;
}

module.exports = {
    async: true,
    filter: async (files, pr, token, pathToCodeOwners, callback) => {
        const fileData = await loadCodeownersFile(pr.author, pr.repo, token, pathToCodeOwners);
        const mapping = codeownersMapping(fileData);

        const result = new Map()
        files.reduce((map, f) => {
            const owners = resolveCodeowners(mapping, f)
                .filter(i => typeof i === 'string')
                .map(u => u.replace(/^@gradle\//, ""));

            owners.forEach(owner => {
                console.log("Mapped: " + f + " -> " + owner)
                if (!map[owner]) {
                    map.set(owner, []);
                }
                map.get(owner).push(f);
            });

            return map;
        }, result);

        console.log("Result keys: ");
        console.log([...result.keys()]);
        console.log("Result values: ");
        console.log([...result.values()]);
        return callback(null, result);
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
