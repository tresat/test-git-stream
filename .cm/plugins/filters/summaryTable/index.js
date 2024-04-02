/**
 * @module summaryTable
 * @description Create a string containing an HTML table describing the given summary statistics.
 *
 * The table should be in descending order of the number of lines changed, and should only include platforms with non-0 changes.
 *
 * @param {[Object]} statistics - list of summary data objects from computeStatistics
 * @returns {String} Returns the formatted HTMl table string.
 * @example {{ branch.diff.files_metadata | groupByPlatform | computeStatistics | summaryTable(branch.diff.files_metadata) }}
 */
function summaryTable(statistics) {
    let preppedStatistics = statistics.filter(s => s.files.length > 0)
        .sort(s => s.additions + s.deletions);
    console.log("Prepped Statistics: " + preppedStatistics);

    let totalAdditions = Object.values(preppedStatistics).reduce((acc, summary) => acc + summary.additions, 0);
    let totalDeletions = Object.values(preppedStatistics).reduce((acc, summary) => acc + summary.deletions, 0);
    console.log("Total Additions: " + totalAdditions);
    console.log("Total Deletions: " + totalDeletions);
    let newRatio = totalAdditions / (totalAdditions + totalDeletions) * 100;
    console.log("New Ratio: " + newRatio);

    let result = ` **Change Summary: this PR is ${Math.round(newRatio, 2)}% new code**
         ${platformsAffected(preppedStatistics)}`;
    //     <details>
    //     <summary>See details</summary>
    //     <table>
    //         <tr>
    //             <td>Platform</td>
    //             <td>Added Lines</td>
    //             <td>% of Total Line Changes</td>
    //             <td>Deleted Lines</td>
    //             <td>% of Total Line Changes</td>
    //             <td>Files Changed</td>
    //             <td>% of Total Files Changed</td>
    //         </tr>`;
    //
    // preppedStatistics.forEach(summary => {
    //     result += `<tr>
    //         <td>${summary.name}</td>
    //         <td>${summary.additions}</td>
    //         <td>${summary.additionPercent}%</td>
    //         <td>${summary.deletions}</td>
    //         <td>${summary.deletionPercent}%</td>
    //         <td>${summary.files.length}</td>
    //         <td>${summary.filesPercent}%</td>
    //     </tr>`;
    // });
    //
    // result += `</table>
    //     </details>
    //     <automation id="summary_table/summary_table"/>`;
    console.log("Finished summaryTable: " + result);

    return result;
}

function platformsAffected(statistics) {
    // Significance is defined as a platform having more than 10% of the total lines changed
    let totalLinesChanged = statistics.reduce((acc, summary) => acc + summary.additions + summary.deletions, 0);
    let platformHasSignificantChanges = function(summary) {
        let linesChanged = summary.additions + summary.deletions;
        return (linesChanged > 1) && (linesChanged / totalLinesChanged >= 0.1);
    };
    let platformsWithSignificantChanges = statistics.filter(platformHasSignificantChanges);
    console.log("Platforms with significant changes: " + platformsWithSignificantChanges.length);

    let result = "";
    if (statistics.length > 1) {
        result += statistics.length + " platforms were affected";
    } else {
        result += "1 platform was affected";
    }
    if (platformsWithSignificantChanges.length > 1) {
        result += " (if possible, only one platform should have significant changes in a PR)";
    } else {
        result += " ";
    }

    console.log("Finished platformsAffected: " + result);
    return result;
}

module.exports = summaryTable;
