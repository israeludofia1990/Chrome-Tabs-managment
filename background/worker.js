//const source = require('./helpers');
const irrelevantSubdomains = ['www', 'm'];

const relevantSubdomains = [];

// Function to get the root domain, considering relevant and irrelevant subdomains
function getNormalizedDomain(url) {
  let DomainurlObj = new URL(url);
  let domainParts = DomainurlObj.hostname.split('.');

  // Handle domains like 'example.co.uk' (i.e., 3+ parts for country code TLDs)
  if (domainParts.length > 2) {
    const [subdomain, ...rest] = domainParts;

    // Check if the subdomain is irrelevant (e.g., 'www') and remove it
    if (irrelevantSubdomains.includes(subdomain.toLowerCase())) {
      return rest.join('.');
    }

    // Check if the subdomain is relevant and keep it
    if (relevantSubdomains.includes(subdomain.toLowerCase())) {
      return DomainurlObj.hostname; 
    }
  }

  // Default to keeping the domain as-is if no conditions are met
  return DomainurlObj.hostname;
}

// Function to normalize the URL
function normalizeUrl(url) {
  let urlObj = new URL(url);

  // Normalize the domain (handle relevant/irrelevant subdomains)
  let normalizedDomain = getNormalizedDomain(url);

  // Rebuild the URL with normalized domain and path
  //let normalizedUrl = `${urlObj.protocol}``${normalizedDomain}``${urlObj.pathname}`;
  let normalizedUrl = `${urlObj.protocol}//${normalizedDomain}${urlObj.pathname}`;

  // Remove fragment and irrelevant query parameters
  urlObj.hash = '';
  urlObj.searchParams.delete('utm_source');
  urlObj.searchParams.delete('utm_medium');
  urlObj.searchParams.delete('utm_campaign');

  return normalizedUrl;
}

chrome.tabs.onUpdated.addListener(checkTabs);

function checkTabs() {
    // Step 1: Remove duplicate tabs
    removeDuplicateTabs(function() {
        // Step 2: After duplicates are removed, check for the tab limit
        checkTabLimit();
    });
}

// Step 1: Function to remove duplicate tabs
function removeDuplicateTabs(callback) {
    chrome.tabs.query({}, function(tabs) {
        let openTabs = {};

        tabs.forEach(tab => {
            // Skip tabs that are still loading
            if (tab.status === "loading") {
                return;
            }

            // Normalize the URL for comparison (you need to define `normalizeUrl`)
            let normalizedUrl = normalizeUrl(tab.url);

            if (openTabs[normalizedUrl]) {
                // Check if the titles are also similar (optional, can be based on URL alone)
                if (openTabs[normalizedUrl].title === tab.title) {
                    // Duplicate found, close the tab (skip pinned and active tabs)
                    if (!tab.pinned && !tab.active) {
                        chrome.tabs.remove(tab.id);
                    }
                }
            } else {
                // Store the tab's metadata
                openTabs[normalizedUrl] = { title: tab.title, id: tab.id };
            }
        });

        // After duplicates are processed, call the callback function
        if (callback) {
            callback();
        }
    });
}

function checkTabLimit() {
    chrome.tabs.query({}, function(tabs) {
        chrome.storage.sync.get(['tabLimit'], function(result) {
            const tabLimit = result.tabLimit || 10; // Default limit if none set
            if (tabs.length > tabLimit) {
                const excessTabs = getExcessTabs(tabs, tabLimit);
                notifyUserOfExcessTabs(excessTabs);
            }
        });
    });
}

function getExcessTabs(tabs, tabLimit) {
    const sortedTabs = tabs.sort((a, b) => a.lastAccessed - b.lastAccessed);
    return sortedTabs.slice(0, tabs.length - tabLimit); // Get the oldest tabs
}

// Notify the user about excess tabs
function notifyUserOfExcessTabs(excessTabs) {
    chrome.notifications.create({
        type: 'basic',
        iconUrl: '../Assets/icon128.png', // Path to your icon
        title: 'Tab Limit Exceeded',
        message: `You have ${excessTabs.length} excess tabs. What would you like to do?`,
        buttons: [
            { title: 'Close Oldest Tabs' },
            { title: 'Save Tabs' }
        ],
        priority: 2
    });

    // Handle button clicks
    chrome.notifications.onButtonClicked.addListener(function(notificationId, buttonIndex) {
        if (buttonIndex === 0) {
            closeTabs(excessTabs);
        } else if (buttonIndex === 1) {
            saveTabs(excessTabs);
        }
    });
}

// Close excess tabs
function closeTabs(tabsToClose) {
    // Filter out pinned or active tabs
    const filteredTabs = tabsToClose.filter(tab => !tab.pinned && !tab.active);

    // Map to get the IDs of the filtered tabs
    const tabIds = filteredTabs.map(tab => tab.id);

    if (tabIds.length > 0) {
        // Close only the non-pinned, non-active tabs
        chrome.tabs.remove(tabIds, function() {
            console.log('Excess tabs closed:', tabIds);
        });
    } else {
        console.log('No tabs to close. All excess tabs are either active or pinned.');
    }
}


// Save excess tabs
function saveTabs(tabsToSave) {
    const savedTabs = tabsToSave.map(tab => ({ url: tab.url, title: tab.title }));

    chrome.storage.sync.get(['savedTabs'], function(result) {
        const existingSavedTabs = result.savedTabs || [];
        const updatedSavedTabs = existingSavedTabs.concat(savedTabs);

        chrome.storage.sync.set({ savedTabs: updatedSavedTabs }, function() {
            console.log('Tabs saved successfully:', savedTabs);
        });
    });
}


// chrome.tabs.query({}, function(tabs) {
//     let openTabs = {};
  
//     tabs.forEach(tab => {
//       // Skip tabs that are still loading
//       if (tab.status === "loading") {
//         return;
//       }
//       let normalizedUrl = source.normalizeUrl(tab.url);
  
//       if (openTabs[normalizedUrl]) {
//         // Check if the titles are also similar
//         if (openTabs[normalizedUrl].title === tab.title) {
//           // Duplicate found, close the tab
//           if (!tab.pinned && !tab.active) {
//             chrome.tabs.remove(tab.id);
//           }
//         }
//       } else {
//         // Store the tab's metadata
//         openTabs[normalizedUrl] = { title: tab.title, id: tab.id };
//       }
//     });
//   });