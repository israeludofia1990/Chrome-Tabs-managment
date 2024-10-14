document.getElementById('saveLimit').addEventListener('click', function() {
    const tabLimit = parseInt(document.getElementById('tabLimit').value);
    
    if (!isNaN(tabLimit)) {  // Ensure a valid number is provided
        chrome.storage.sync.set({ tabLimit }, function() {
            // Show a success message
            const message = document.getElementById('message');
            message.style.display = 'block';
            setTimeout(() => message.style.display = 'none', 2000);  // Hide message after 2 seconds
        });
    } else {
        alert('Please enter a valid number.');
    }
});

// Load the current tab limit when the options page is opened
document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.sync.get(['tabLimit'], function(result) {
        if (result.tabLimit) {
            document.getElementById('tabLimit').value = result.tabLimit;
        }
    });
});


// document.getElementById('saveLimit').addEventListener('click', function() {
//     const tabLimit = document.getElementById('tabLimit').value;
//     if (tabLimit) {
//         chrome.storage.sync.set({ tabLimit: parseInt(tabLimit) }, function() {
//             alert('Tab limit saved!');
//         });
//     }
// });
// document.getElementById('saveLimit').addEventListener('click', function() {
//     const tabLimit = document.getElementById('tabLimit').value;
//     chrome.storage.sync.set({ tabLimit: parseInt(tabLimit) }, function() {
//         //console.log('Tab limit saved:', tabLimit);
//         alert('Tab limit saved!');
//     });
// });

// // Load the current tab limit when the options page is opened
// document.addEventListener('DOMContentLoaded', function() {
//     chrome.storage.sync.get(['tabLimit'], function(result) {
//         if (result.tabLimit) {
//             document.getElementById('tabLimit').value = result.tabLimit;
//         }
//     });
// });
