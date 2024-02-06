const platforms = {
    bt_ge_build_cache: {
        name: 'bt_ge_build_cache',
        subprojects: [
            'platforms/core-execution/build-cache/',
            'platforms/core-execution/build-cache-base/',
            'platforms/core-execution/build-cache-http/',
            'platforms/core-execution/build-cache-packaging/',
            'platforms/core-runtime/build-operations/',
            'platforms/core-runtime/files/',
            'platforms/core-execution/hashing/',
            'platforms/core-execution/snapshots/',
        ],
    },
    build_infrastructure: {
        name: 'build_infrastructure',
        subprojects: [
            '.teamcity/',
            '.github/',
            '/build-logic/',
            '/build-logic-commons/',
            '/build-logic-settings/',
            '/build.gradle*',
            '/settings.gradle*',
            'gradle/shared-with-buildSrc/',
            'subprojects/internal-architecture-testing/',
            'subprojects/internal-build-reports/',
            'subprojects/internal-integ-testing/',
            'subprojects/internal-performance-testing/',
            'subprojects/internal-testing/',
        ],
    },
    core_configuration: {
        name: 'core_configuration',
        subprojects: ['platforms/core-configuration/'],
    },
    core_execution: {
        name: 'core_execution',
        subprojects: ['platforms/core-runtime/'],
    },
    core_runtime: {
        name: 'core_runtime',
        subprojects: ['platforms/core-runtime/'],
    },
    documentation: {
        name: 'documentation',
        subprojects: ['platforms/documentation/'],
    },
    extensibility: {
        name: 'extensibility',
        subprojects: [
            'subprojects/plugin-development/',
            'subprojects/plugin-use/',
            'subprojects/test-kit/',
        ],
    },
    gradle_enterprise: {
        name: 'gradle_enterprise',
        subprojects: ['platforms/enterprise/'],
    },
    native: {
        name: 'native',
        subprojects: ['platforms/native/'],
    },
    ide: {
        name: 'ide',
        subprojects: ['platforms/ide/'],
    },
    jvm: {
        name: 'jvm',
        subprojects: [
            'platforms/jvm/',
            'subprojects/plugins/'
        ],
    },
    kotlin_dsl: {
        name: 'kotlin_dsl',
        subprojects: [
            'platforms/core-configuration/kotlin-dsl/',
            'platforms/core-configuration/kotlin-dsl-integ-tests/',
            'platforms/core-configuration/kotlin-dsl-plugins/',
            'platforms/core-configuration/kotlin-dsl-provider-plugins/',
            'platforms/core-configuration/kotlin-dsl-tooling-builders/',
            'platforms/core-configuration/kotlin-dsl-tooling-models/',
            'build-logic/kotlin-dsl/',
            'platforms/documentation/docs/src/snippets/kotlinDsl/',
        ],
    },
    release_coordination: {
        name: 'release_coordination',
        subprojects: [
            'subprojects/core-platform/',
            'subprojects/distributions-dependencies/',
            'subprojects/distributions-full/',
            'subprojects/performance/',
            'subprojects/smoke-test/',
            'subprojects/soak/',
        ],
    },
    software: {
        name: 'software',
        subprojects: ['platforms/software/'],
    },
};

/**
 * @module getPlatforms
 * @description Returns a mapping of platforms to the information about the files involved in the PR contained in each platform
 * @param {FileMetadata} fileMetadata - gitStream's list of changes files including path and other context
 * @returns {Map} Returns a mapping of platforms to the given files in that platform
 * @example {{ branch.diff.files_metadata | getPlatforms }}
 */

function getPlatforms(fileMetadata) {
    return Object.entries(platforms).reduce((map, [platform, { subprojects }]) => {
        const files = fileMetadata.filter(({ path }) =>
            subprojects.some(subproject => path.includes(subproject))
        );
        if (files.length > 0) {
            map[platform] = files;
        }

        console.log("Map: " + map);

        return map;
    }, {});
}

module.exports = isEnabledUser;