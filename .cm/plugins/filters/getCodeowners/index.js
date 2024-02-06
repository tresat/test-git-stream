/**
 * @module getCodeowners
 * @description Resolves the PR's code owners based on the repository's CODEOWNERS file
 * @param {string[]} files - the gitStream's files context variable
 * @param {Object} pr - the gitStream's pr context variable
 * @param {string} token - access token with repo:read scope, used to read the CODEOWNERS file
 * @returns {string[]} user names
 * @example {{ files | getCodeowners(pr, env.CODEOWNERS_TOKEN) }}
 * @license MIT
 **/


const { Octokit } = require("@octokit/rest");
// const ignore = require('./ignore/index.js');

async function loadCodeownersFile(owner, repo, auth) {
    const octokit = new Octokit({
        request: { fetch },
        auth,
    });

    console.log("ahead of getContent, token: " + auth)
    const res = await octokit.repos.getContent({
        owner,
        repo,
        path: 'CODEOWNERS'
    });
    console.log("Done getContent")

    return Buffer.from(res.data.content, 'base64').toString()
}
//
// function codeownersMapping(data) {
//     return data
//         .toString()
//         .split('\n')
//         .filter(x => x && !x.startsWith('#'))
//         .map(x => x.split("#")[0])
//         .map(x => {
//             const line = x.trim();
//             const [path, ...owners] = line.split(/\s+/);
//             return {path, owners};
//         });
// }
//
// function resolveCodeowner(mapping, file) {
//     const match = mapping
//         .slice()
//         .reverse()
//         .find(x =>
//             ignore()
//                 .add(x.path)
//                 .ignores(file)
//         );
//     if (!match) return false;
//     return match.owners;
// }

// module.exports = {
//     async: true,
//     filter: async (files, pr, token, callback) => {
//         console.log("TESTING ASYNCHRONOUS FILTERS")
//
//         // const fileData = await loadCodeownersFile(pr.author, pr.repo, token);
//         // console.log("Done fileData")
//         // console.log("fileData", fileData)
//         // const mapping = codeownersMapping(fileData);
//         // console.log("Done codeownersMapping")
//         // console.log("codeownersMapping", mapping)
//         //
//         // const resolved = files
//         //     .map(f => resolveCodeowner(mapping, f))
//         //     .flat()
//         //     .filter(i => typeof i === 'string')
//         //     .map(u => u.replace(/^@/, ""));
//         //
//         // const unique = [...new Set(resolved)];
//
//         return callback(null, ["heyo"]);
//     },
// }

const myFilter = async (files, pr, token, callback) => {
    const message = { text: "Hello ${files}!" };
    const error = null;
    console.log(message)
    console.log(token)

    const fileData = await loadCodeownersFile(pr.author, pr.repo, token);
    console.log("Done fileData")
    console.log("fileData", fileData)

    return callback(error, message.text);
};

module.exports = {
    async: true,
    filter: myFilter
}