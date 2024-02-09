/**
 * @module getStatisticForGroup
 * @description Returns
 * @param {[Object]} statistics -
 * @param {String} groupName -
 * @param {String} statisticName -
 * @returns {[Object]} Returns a list of objects for each platform containing info about the changes to files in that platform
 * @example {{ statsByPlatform | getByName('jvm', 'name') }}
 */

function getStatisticForGroup(statistics, groupName, statisticName) {
    let group = statistics.find(s => s.name === groupName);
    if (group) {
        console.log('Group: ' + group + ' found for: ' + groupName);
        let stat = group[statisticName];
        console.log('Stat: ' + stat);
        return stat;
    } else {
        console.log('Group not found: ' + groupName);
        return null;
    }
}

module.exports = getStatisticForGroup;