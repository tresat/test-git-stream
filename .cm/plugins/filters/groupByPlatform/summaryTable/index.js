/**
 * @module summaryTable
 * @description Create a string containing an HTML table describing the given summary statistics.
 * @param {[Object]} summaries - list of summary data objects
 * @param {String} title - how the data is sliced into summaries, for the title of the table
 * @returns {String} Returns the formatted HTMl table string.
 * @example {{ groupByPlatform | summaryTable(branch.diff.files_metadata, 'Platform') }}
 */
function summaryTable(summaries, title) {
    let totalFiles = summaries.reduce((summary, acc) => acc += summary.files.length, 0);

    let result = `<h3> Changes by ${title} </h3>
        <table>
        <tr> 
            <td>${title}</td> 
            <td>Added Lines</td> 
            <td>% of Total Line Changes</td> 
            <td>Deleted Lines</td> 
            <td>% of Total Line Changes</td> 
            <td>Files Changed</td> 
            <td>% of Total Files Changed</td> 
        </tr>`;

    summaries.forEach(summary => {
        result += `<tr>
            <td>${summary.name}</td>
            <td>${summary.additions}</td>
            <td>${summary.additionPercent}%</td>
            <td>${summary.deletions}</td>
            <td>${summary.deletionPercent}%</td>
            <td>${summary.files.length}</td>
            <td>${Math.round(summary.files.length / totalFiles * 100)}%</td>
        </tr>`;
    });

    result += '</table>';

    return result;
}

module.exports = summaryTable;
