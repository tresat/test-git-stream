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
        files.map(f => {
            const owners = resolveCodeowners(mapping, f);
            console.log("*** PRE file: " + f + " codeowners: " + owners);
            owners.filter(i => typeof i === 'string')
                .map(u => u.replace(/^@gradle\//, ""))
                .forEach(owner => {
                    console.log("*** assigning owner: " + owner);
                    if (!result.has(owner)) {
                        console.log("*** allocating new array for owner: " + owner);
                        result.set(owner, []);
                    }
                    let assigned = result.get(owner);
                    console.log("*** PRE assignment: " + assigned);
                    assigned = assigned.push(f);
                    console.log("*** AFTER push : " + assigned);
                    result.set(owner, assigned);
                    console.log("*** POST assignment: " + result.get(owner));
                });
            console.log("*** POST file: " + f + " owners: " + owners);
        });

        console.log("getCodeowners: ");
        [...result.keys()].forEach(owner => {
            console.log(owner + ": " + result.get(owner).join(", "));
        });
        return callback(null, result);
    },
}
