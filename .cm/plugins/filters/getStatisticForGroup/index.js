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
    return statistics.find(s => s.name === groupName).statisticName;
}

module.exports = getStatisticForGroup;