/**
 * @module changeStatistics
 * @description Summarizes .
 * @param {Map} groupedFiles -
 * @param {Map} fileMetadatas -
 * @returns {Map} Returns .
 * @example {{ filesByPlatform | changeStatistics(branch.diff.files_metadata) }}
 */
function changeStatistics(groupedFiles, fileMetadatas) {
    let totalAdditions = 0;
    let totalDeletions = 0
    let totalChangedFiles = 0;

    let result = new Map(
        [...groupedFiles].filter(([, summary]) => summary.files.length > 0 )
            .sort(([, summary]) => summary.files.length)
    );

    [...result.values()].forEach(summary => {
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

    [...result.values()].forEach(summary => {
        summary.additionPercent = Math.round(summary.additions / (totalAdditions + totalDeletions) * 100, 2);
        summary.deletionPercent = Math.round(summary.deletions / (totalAdditions + totalDeletions) * 100, 2);
        summary.filesPercent = Math.round(summary.files.length / totalChangedFiles * 100, 2);
    });

    return result;
}

function metadataFor(fileMetadatas, file) {
    return fileMetadatas.find(fileMetadata => fileMetadata.file == file);
}

module.exports = changeStatistics;
