const irrelevantSubdomains = ['www', 'm'];
const relevantSubdomains = [];

// Function to get the root domain, considering relevant and irrelevant subdomains
function getNormalizedDomain(url) {
    try {
        let domainUrlObj = new URL(url);
        let domainParts = domainUrlObj.hostname.split('.');

        // Handle domains like 'example.co.uk' (i.e., 3+ parts for country code TLDs)
        if (domainParts.length > 2) {
            const [subdomain, ...rest] = domainParts;

            // Check if the subdomain is irrelevant (e.g., 'www') and remove it
            if (irrelevantSubdomains.includes(subdomain.toLowerCase())) {
                return rest.join('.');
            }

            // Check if the subdomain is relevant and keep it
            if (relevantSubdomains.includes(subdomain.toLowerCase())) {
                return domainUrlObj.hostname;
            }
        }

        // Default to keeping the domain as-is if no conditions are met
        return domainUrlObj.hostname;
    } catch (error) {
        console.error('Invalid URL:', url);
        return url; // Return the original URL if there's an error
    }
}

// Function to normalize the URL
function normalizeUrl(url) {
    try {
        let urlObj = new URL(url);

        // Normalize the domain (handle relevant/irrelevant subdomains)
        let normalizedDomain = getNormalizedDomain(url);

        // Rebuild the URL with normalized domain and path
        let normalizedUrl = `${urlObj.protocol}//${normalizedDomain}${urlObj.pathname}`;

        // Remove fragment and irrelevant query parameters
        urlObj.hash = '';
        urlObj.searchParams.delete('utm_source');
        urlObj.searchParams.delete('utm_medium');
        urlObj.searchParams.delete('utm_campaign');

        return normalizedUrl;
    } catch (error) {
        console.error('Error normalizing URL:', url);
        return url; // Return the original URL in case of error
    }
}

// Step 1: Function to remove duplicate tabs
function removeDuplicateTabs(callback) {
    chrome.tabs.query({}, function(tabs) {
        let openTabs = {};
        let duplicatesRemoved = 0; // Counter for duplicates removed

        tabs.forEach(tab => {
            // Skip tabs that are still loading
            if (tab.status === "loading") {
                return;
            }

            // Normalize the URL for comparison
            let normalizedUrl = normalizeUrl(tab.url);

            if (openTabs[normalizedUrl]) {
                // Duplicate found
                if (tab.pinned || tab.active) {
                    // If the current tab is pinned or active, close all other duplicates
                    chrome.tabs.remove(openTabs[normalizedUrl].id); // Close the previously stored tab
                    openTabs[normalizedUrl] = tab; // Update to keep the current tab
                    duplicatesRemoved++;
                } else {
                    // If the current tab is not pinned or active, close it
                    chrome.tabs.remove(tab.id);
                    duplicatesRemoved++;
                }
            } else {
                // Store the tab's metadata
                openTabs[normalizedUrl] = { title: tab.title, id: tab.id };
            }
        });

        // Notify the user about the number of duplicates removed
        if (duplicatesRemoved > 0) {
            chrome.notifications.create('duplicateTabsNotification', {
                type: 'basic',
                iconUrl: '../Assets/icon128.png', // Path to your icon
                title: 'Tab Duplicates Removed',
                message: `${duplicatesRemoved} duplicate tab(s) were removed.`,
                priority: 2
            });
        }

        // After duplicates are processed, call the callback function (if provided)
        if (typeof callback === 'function') {
            callback();
        }
    });
}

// Event listeners for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') { // Only check when the tab is fully loaded
        removeDuplicateTabs();
    }
});

// Listen for created and updated tabs to check the tab limit
chrome.tabs.onCreated.addListener(checkTabLimit);
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo.status === 'complete') {
        checkTabLimit();
    }
});

function checkTabLimit() {
    chrome.storage.sync.get(['tabLimit'], function(result) {
        const tabLimit = result.tabLimit || 10; // Default limit if not set

        chrome.tabs.query({}, function(tabs) {
            const openTabsCount = tabs.length;

            if (openTabsCount > tabLimit) {
                handleExcessTabs(tabs, openTabsCount, tabLimit);
            }
        });
    });
}

function handleExcessTabs(tabs, openTabsCount, tabLimit) {
    // Sort tabs by their last active time (oldest first)
    const sortedTabs = tabs.sort((a, b) => a.lastAccessed - b.lastAccessed);
    const excessTabs = sortedTabs.slice(0, openTabsCount - tabLimit); // Get the oldest excess tabs

    let closeTabs = [];
    excessTabs.forEach(tab => {
        closeTabs.push({
            id: tab.id,
            url: tab.url,
            title: tab.title
        });
    });

    // Notify the user about the excess tabs
    chrome.notifications.create('excessTabsNotification', {
        type: 'basic',
        iconUrl: '../Assets/icon128.png',
        title: 'Tab Limit Exceeded',
        message: `You have ${openTabsCount} open tabs, exceeding your limit of ${tabLimit}.`,
        priority: 2,
        buttons: [
            { title: 'Manage Excess Tabs' }
        ]
    });

    // Handle button clicks for the excess tabs notification
    chrome.notifications.onButtonClicked.addListener((notifId, btnIdx) => {
        if (notifId === 'excessTabsNotification') {
            if (btnIdx === 0) { // Manage excess tabs
                // Open a new tab to manage the excess tabs
                chrome.tabs.create({ url: chrome.runtime.getURL("../helpers/HTML/manage_tabs.html") }, (tab) => {
                    // Send the closeTabs data to the new tab
                    chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
                        if (tabId === tab.id && changeInfo.status === "complete") {
                            chrome.tabs.onUpdated.removeListener(listener);
                            chrome.tabs.sendMessage(tabId, { action: "loadTabs", tabs: closeTabs });
                        }
                    });
                });
            }
        }
    });
}

// Function to close a list of tabs
function closeExcessTabs(tabsToClose) {
    tabsToClose.forEach(tab => {
        chrome.tabs.remove(tab.id);
    });
}

// Function to save a list of tabs
function saveExcessTabs(tabsToSave) {
    const savedTabs = tabsToSave.map(tab => tab.url);
    chrome.storage.sync.get('savedTabs', function(result) {
        const allSavedTabs = result.savedTabs ? result.savedTabs.concat(savedTabs) : savedTabs;
        chrome.storage.sync.set({ savedTabs: allSavedTabs }, function() {
            alert('Tabs saved for later!');
        });
    });
}


// function handleExcessTabs(tabs, openTabsCount, tabLimit) {
//     // Sort tabs by their last active time (oldest first)
//     const sortedTabs = tabs.sort((a, b) => a.lastAccessed - b.lastAccessed);
//     const excessTabs = sortedTabs.slice(0, openTabsCount - tabLimit); // Get the oldest excess tabs

//     let excessTabsobj = [];
//     excessTabs.forEach(tab => {
//         excessTabsobj.push({
//             id: tab.id,
//             url: tab.url,
//             title: tab.title
//         });
//     });

//     // Notify the user about the excess tabs
//     chrome.notifications.create('excessTabsNotification', {
//         type: 'basic',
//         iconUrl: '../Assets/icon128.png', // Use your own icon
//         title: 'Tab Limit Exceeded',
//         message: `You have ${openTabsCount} open tabs, exceeding your limit of ${tabLimit}.`,
//         priority: 2,
//         buttons: [
//             { title: 'Manage Excess Tabs' },
//             //{ title: 'Save Tabs' }
//         ]
//     });

//     // Handle button clicks (only for the excess tabs notification)
//     chrome.notifications.onButtonClicked.addListener((notifId, btnIdx) => {
//         if (notifId === 'excessTabsNotification') {
//             if (btnIdx === 0) { // Close excess tabs
//                 closeExcessTabs(closeTabs);
//             } else if (btnIdx === 1) { // Save tabs
//                 saveExcessTabs(closeTabs);
//             }
//         }
//     });
// }

// function closeExcessTabs(tabsToClose) {
//     tabsToClose.forEach(tab => {
//         chrome.tabs.remove(tab.id);
//     });
// }

// function saveExcessTabs(tabsToSave) {
//     // Store the URLs of the tabs to be saved in chrome storage
//     const savedTabs = tabsToSave.map(tab => tab.url);
//     chrome.storage.sync.set({ savedTabs }, function() {
//         alert('Excess tabs saved for later!');
//     });
// }

// const irrelevantSubdomains = ['www', 'm'];
// const relevantSubdomains = [];

// // Function to get the root domain, considering relevant and irrelevant subdomains
// function getNormalizedDomain(url) {
//     let DomainurlObj = new URL(url);
//     let domainParts = DomainurlObj.hostname.split('.');

//     // Handle domains like 'example.co.uk' (i.e., 3+ parts for country code TLDs)
//     if (domainParts.length > 2) {
//         const [subdomain, ...rest] = domainParts;

//         // Check if the subdomain is irrelevant (e.g., 'www') and remove it
//         if (irrelevantSubdomains.includes(subdomain.toLowerCase())) {
//             return rest.join('.');
//         }

//         // Check if the subdomain is relevant and keep it
//         if (relevantSubdomains.includes(subdomain.toLowerCase())) {
//             return DomainurlObj.hostname; 
//         }
//     }

//     // Default to keeping the domain as-is if no conditions are met
//     return DomainurlObj.hostname;
// }

// // Function to normalize the URL
// function normalizeUrl(url) {
//     let urlObj = new URL(url);

//     // Normalize the domain (handle relevant/irrelevant subdomains)
//     let normalizedDomain = getNormalizedDomain(url);

//     // Rebuild the URL with normalized domain and path
//     let normalizedUrl = `${urlObj.protocol}//${normalizedDomain}${urlObj.pathname}`;

//     // Remove fragment and irrelevant query parameters
//     urlObj.hash = '';
//     urlObj.searchParams.delete('utm_source');
//     urlObj.searchParams.delete('utm_medium');
//     urlObj.searchParams.delete('utm_campaign');

//     return normalizedUrl;
// }

// // Step 1: Function to remove duplicate tabs
// function removeDuplicateTabs(callback) {
//     chrome.tabs.query({}, function(tabs) {
//         let openTabs = {};
//         let duplicatesRemoved = 0; // Counter for duplicates removed

//         tabs.forEach(tab => {
//             // Skip tabs that are still loading
//             if (tab.status === "loading") {
//                 return;
//             }

//             // Normalize the URL for comparison
//             let normalizedUrl = normalizeUrl(tab.url);

//             if (openTabs[normalizedUrl]) {
//                 // Duplicate found
//                 if (tab.pinned || tab.active) {
//                     // If the current tab is pinned or active, close all other duplicates
//                     chrome.tabs.remove(openTabs[normalizedUrl].id); // Close the previously stored tab
//                     openTabs[normalizedUrl] = tab; // Update to keep the current tab
//                     duplicatesRemoved++;
//                 } else {
//                     // If the current tab is not pinned or active, close it
//                     chrome.tabs.remove(tab.id);
//                     duplicatesRemoved++;
//                 }
//             } else {
//                 // Store the tab's metadata
//                 openTabs[normalizedUrl] = { title: tab.title, id: tab.id };
//             }
//         });

//         // Notify the user about the number of duplicates removed
//         if (duplicatesRemoved > 0) {
//             chrome.notifications.create({
//                 type: 'basic',
//                 iconUrl: '../Assets/icon128.png', // Path to your icon
//                 title: 'Tab Duplicates Removed',
//                 message: `${duplicatesRemoved} duplicate tab(s) were removed.`,
//                 priority: 2
//             });
//         }

//         // After duplicates are processed, call the callback function
//         if (callback) {
//             callback();
//         }
//     });
// }

// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//     if (changeInfo.status === 'complete') { // Only check when the tab is fully loaded
//         removeDuplicateTabs();
//     }
// });

// chrome.tabs.onCreated.addListener(checkTabLimit);
// chrome.tabs.onUpdated.addListener(checkTabLimit);

// function checkTabLimit() {
//     chrome.storage.sync.get(['tabLimit'], function(result) {
//         const tabLimit = result.tabLimit || 10; // Default limit if not set

//         chrome.tabs.query({}, function(tabs) {
//             const openTabsCount = tabs.length;

//             if (openTabsCount > tabLimit) {
//                 handleExcessTabs(tabs, openTabsCount, tabLimit);
//             }
//         });
//     });
// }

// function handleExcessTabs(tabs, openTabsCount, tabLimit) {
//     // Sort tabs by their last active time (oldest first)
//     const sortedTabs = tabs.sort((a, b) => a.lastAccessed - b.lastAccessed);
//     const excessTabs = sortedTabs.slice(0, openTabsCount - tabLimit); // Get the oldest excess tabs

//     let closeTabs = [];
//     excessTabs.forEach(tab => {
//         closeTabs.push({
//             id: tab.id,
//             url: tab.url,
//             title: tab.title
//         });
//     });

//     // Notify the user about the excess tabs
//     chrome.notifications.create({
//         type: 'basic',
//         iconUrl: '../Assets/icon128.png', // Use your own icon
//         title: 'Tab Limit Exceeded',
//         message: `You have ${openTabsCount} open tabs, exceeding your limit of ${tabLimit}.`,
//         priority: 2,
//         buttons: [
//             { title: 'Close Excess Tabs' },
//             { title: 'Save Tabs' }
//         ]
//     });

//     // Handle button clicks
//     chrome.notifications.onButtonClicked.addListener((notifId, btnIdx) => {
//         if (btnIdx === 0) { // Close excess tabs
//             closeExcessTabs(closeTabs);
//         } else if (btnIdx === 1) { // Save tabs
//             saveExcessTabs(closeTabs);
//         }
//     });
// }

// function closeExcessTabs(tabsToClose) {
//     tabsToClose.forEach(tab => {
//         chrome.tabs.remove(tab.id);
//     });
// }

// function saveExcessTabs(tabsToSave) {
//     // Store the URLs of the tabs to be saved in chrome storage
//     const savedTabs = tabsToSave.map(tab => tab.url);
//     chrome.storage.sync.set({ savedTabs }, function() {
//         alert('Excess tabs saved for later!');
//     });
// }

// // // Function to check tabs on update
// // chrome.tabs.onUpdated.addListener(checkTabs);

// // function checkTabs() {
// //     // Step 1: Remove duplicate tabs
// //     removeDuplicateTabs(function() {
// //         // Step 2: After duplicates are removed, check for the tab limit
// //         checkTabLimit();
// //     });
// // }