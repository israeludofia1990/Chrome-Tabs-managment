document.addEventListener('DOMContentLoaded', function() {
    // Load the current tab limit
    chrome.storage.sync.get(['tabLimit'], function(result) {
        const tabLimit = result.tabLimit || 'Not set';
        document.getElementById('currentLimit').textContent = ` ${tabLimit}`;
    });

    // Open the options page when the button is clicked
    document.getElementById('openOptions').addEventListener('click', function() {
        chrome.tabs.create({ url: chrome.runtime.getURL('options/options.html') });
    });
});


// document.addEventListener('DOMContentLoaded', function() {
//     // Load the current tab limit
//     chrome.storage.sync.get(['tabLimit'], function(result) {
//         const tabLimit = result.tabLimit || 'Not set';
//         document.getElementById('currentLimit').textContent = `Current tab limit: ${tabLimit}`;
//     });

//     // Open the options page when the button is clicked
//     document.getElementById('openOptions').addEventListener('click', function() {
//         chrome.tabs.create({ url: chrome.runtime.getURL('../options/options.html') });
//     });
// });