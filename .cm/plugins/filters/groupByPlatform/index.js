/**
 * @module groupByPlatform
 * @description Returns a mapping of platforms to the information about the files involved in the PR contained in each platform
 * @param {[FileMetadata]} fileMetadatas - gitStream's list of metadata about file changes in the PR including path
 * @param {Map} fileOwners mapping of platform name to a list of files involved in the change located in that platform
 * @returns {[Object]} Returns a list of objects for each platform containing info about the changes to files in that platform
 * @example {{ branch.diff.files_metadata | getPlatforms }}
 */

function groupByPlatform(fileMetadatas, fileOwners) {
    const filesByPlatform = new Map();
    [...fileOwners.keys()].forEach(platform => {
        filesByPlatform.set(platform, {
            name: platform,
            files: []
        });
    });

    Object.values(fileMetadatas).forEach(fileMetadata => {
        [...fileOwners.keys()].forEach(platform => {
            const files = fileOwners.get(platform);
            if (files.includes(fileMetadata.file)) {
                filesByPlatform.get(platform).files.push(fileMetadata.file);
            }
        });
    });

    console.log("groupByPlatform: ");
    console.log([...filesByPlatform.values()]);
    return filesByPlatform;
}

module.exports = groupByPlatform;