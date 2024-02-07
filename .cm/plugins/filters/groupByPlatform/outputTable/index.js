/**
 * @module changeStatistics
 * @description Summarizes .
 * @param {[Object]} summaries -
 * @returns {String} Returns .
 * @example {{ groupByPlatform | changeStatistics(branch.diff.files_metadata) }}
 */
function outputTable(summaries) {
    let result = '<h3> Output Table </h3>';

    summaries.forEach(summary => {
        result += summary.name + '<br>';
        result += summary.files.length + '<br>';
    });

    return result;
}

module.exports = outputTable;
