/**
 * @module getStatFromMap
 * @description Returns
 * @param {Map} statistics -
 * @param {String} key -
 * @param {String} statisticName -
 * @returns {[Object]} Returns a list of objects for each platform containing info about the changes to files in that platform
 * @example {{ statsByPlatform | getByName('jvm', 'name') }}
 */

function getStatFromMap(statistics, key, statisticName) {
    let group = statistics.get(key);
    if (group) {
        console.log('GSFM Group: ' + group + ' found for: ' + groupName);
        let stat = group[statisticName];
        console.log('GSFM Stat: ' + stat);
        return stat;
    } else {
        console.log('GSFM Group not found: ' + groupName);
        return null;
    }
}

module.exports = getStatFromMap;