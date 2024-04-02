/**
 * @module computeStatistics
 * @description Summarizes the changes to files in the PR by platform.
 *
 * @param {[Object]} groupedFiles - list of objects for each platform containing info about the changes to files in that platform, from call to groupByPlatform
 * @param {[FileMetadata]} fileMetadatas - gitStream's list of metadata about file changes in the PR including path
 * @returns {[Object]} Returns list of computed summary statistic objects for each platform in the input groupedFiles
 * @example {{ groupByPlatform | changeStatistics(branch.diff.files_metadata) }}
 */
function computeStatistics(groupedFiles, fileMetadatas) {
    let totalAdditions = 0;
    let totalDeletions = 0
    let totalChangedFiles = 0;

    let result = JSON.parse(JSON.stringify(groupedFiles)); // Deep copy of array

    result.forEach(summary => {
        summary.additions = 0;
        summary.deletions = 0;

        summary.files.forEach(file => {
            let fileMetadata = metadataFor(fileMetadatas, file);
            summary.additions += fileMetadata.additions;
            summary.deletions += fileMetadata.deletions;
            totalAdditions += summary.additions;
            totalDeletions += summary.deletions;
            totalChangedFiles++;
        });
    });

    result.forEach(summary => {
        summary.additionPercent = Math.round(summary.additions / (totalAdditions + totalDeletions) * 100, 2);
        summary.deletionPercent = Math.round(summary.deletions / (totalAdditions + totalDeletions) * 100, 2);
        summary.filesPercent = Math.round(summary.files.length / totalChangedFiles * 100, 2);
    });

    console.log("Statistics: ");
    console.log(result)
    return result;
}

function metadataFor(fileMetadatas, file) {
    return fileMetadatas.find(fileMetadata => fileMetadata.file == file);
}

module.exports = computeStatistics;
