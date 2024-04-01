// Configuration in top of Method definition file

const enabled = new Map();
enabled.set('platform_labels', ['always']);
enabled.set('lacks_tests', ['community', 'tom']);


// Method body
function isEnabledAutomation(automationName, pr) {
    let result = false;
    const automationActivations = enabled.get(automationName) || [];

    // Check if always enabled, or enabled by comment
    if (automationActivations.includes('always')) {
        console.log(automationName + ' is always enabled');
        result = true;
    } else {
        var comments = Object.values(pr.comments);
        result = comments.some(comment => {
            return comment.content.startsWith('@bot-gitstream check all') || comment.content.startsWith('@bot-gitstream check ' + automationName);
        });
    }

    // If not found to be enabled by the above checks, check if enabled by user
    if (!result) {
        if (pr.author_is_org_member) {
            result = automationActivations.includes(pr.author);
            if (result) {
                console.log(automationName + ' is enabled for ' + pr.author);
            }
        } else {
            result = automationActivations.includes('community');
            if (result) {
                console.log(automationName + ' is enabled for community prs');
            }
        }
    }

    return result;
}

// Helpers
function assert(condition) {
    if (!condition) {
        throw new Error('Assertion failed!');
    }
}

// Simulated input from context variables

let pr1 = {
    author: 'bob',
    author_is_org_member: false,
    comments: [
        {
            content: 'Some nonsense'
        }
    ]
};
let automationName1 = 'platform_labels';

var example1 = isEnabledAutomation(automationName1, pr1);
assert(example1);
console.log('platform_labels, non-org Bob, no comments = ' + example1);

let pr2 = {
    author: 'bob',
    author_is_org_member: false,
    comments: [
        {
            content: 'Some nonsense'
        }
    ]
};
let automationName2 = 'lacks_tests';

var example2 = isEnabledAutomation(automationName2, pr2);
assert(example2);
console.log('lacks_tests, non-org Bob, no comments = ' + example2);

let pr3 = {
    author: 'tom',
    author_is_org_member: true,
    comments: [
        {
            content: 'Some nonsense'
        }
    ]
};
let automationName3 = 'lacks_tests';

var example3 = isEnabledAutomation(automationName3, pr3);
assert(example3);
console.log('lacks_tests, org Tom, no comments = ' + example3);

let pr4 = {
    author: 'justin',
    author_is_org_member: true,
    comments: [
        {
            content: 'Some nonsense'
        }
    ]
};
let automationName4 = 'lacks_tests';

var example4 = isEnabledAutomation(automationName4, pr4);
assert(!example4);
console.log('lacks_tests, org Justin, no comments = ' + example4);

let pr5 = {
    author: 'justin',
    author_is_org_member: true,
    comments: [
        {
            content: '@bot-gitstream check all'
        }
    ]
};
let automationName5 = 'lacks_tests';

var example5 = isEnabledAutomation(automationName5, pr5);
assert(example5);
console.log('lacks_tests, org Justin, comment all = ' + example5);

let pr6 = {
    author: 'justin',
    author_is_org_member: true,
    comments: [
        {
            content: '@bot-gitstream check lacks_tests'
        }
    ]
};
let automationName6 = 'lacks_tests';

var example6 = isEnabledAutomation(automationName6, pr6);
assert(example6);
console.log('lacks_tests, org Justin, comment lacks_tests = ' + example6);

let pr7 = {
    author: 'justin',
    author_is_org_member: true,
    comments: [
        {
            content: '@bot-gitstream check something_else'
        }
    ]
};
let automationName7 = 'lacks_tests';

var example7 = isEnabledAutomation(automationName7, pr7);
assert(!example7);
console.log('lacks_tests, org Justin, comment something_else = ' + example7);

let pr8 = {
    author: 'justin',
    author_is_org_member: true,
    comments: [
        {
            content: '@bot-gitstream check something_else'
        }
    ]
};
let automationName8 = 'i_dont_exist';

var example8 = isEnabledAutomation(automationName8, pr8);
assert(!example8);
console.log('non-existant automation = ' + example7);