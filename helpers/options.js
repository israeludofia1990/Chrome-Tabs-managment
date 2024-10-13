// document.getElementById('saveLimit').addEventListener('click', function() {
//     const tabLimit = document.getElementById('tabLimit').value;
//     if (tabLimit) {
//         chrome.storage.sync.set({ tabLimit: parseInt(tabLimit) }, function() {
//             alert('Tab limit saved!');
//         });
//     }
// });
document.getElementById('saveLimit').addEventListener('click', function() {
    const tabLimit = document.getElementById('tabLimit').value;
    chrome.storage.sync.set({ tabLimit: parseInt(tabLimit) }, function() {
        //console.log('Tab limit saved:', tabLimit);
        alert('Tab limit saved!');
    });
});

// Load the current tab limit when the options page is opened
document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.sync.get(['tabLimit'], function(result) {
        if (result.tabLimit) {
            document.getElementById('tabLimit').value = result.tabLimit;
        }
    });
});
