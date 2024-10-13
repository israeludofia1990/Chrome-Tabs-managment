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
    let normalizedUrl = `${urlObj.protocol}//${normalizedDomain}${urlObj.pathname}`;

    // Remove fragment and irrelevant query parameters
    urlObj.hash = '';
    urlObj.searchParams.delete('utm_source');
    urlObj.searchParams.delete('utm_medium');
    urlObj.searchParams.delete('utm_campaign');

    return normalizedUrl;
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
            chrome.notifications.create({
                type: 'basic',
                iconUrl: '../Assets/icon128.png', // Path to your icon
                title: 'Tab Duplicates Removed',
                message: `${duplicatesRemoved} duplicate tab(s) were removed.`,
                priority: 2
            });
        }

        // After duplicates are processed, call the callback function
        if (callback) {
            callback();
        }
    });
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') { // Only check when the tab is fully loaded
        removeDuplicateTabs();
    }
});

// // Function to check tabs on update
// chrome.tabs.onUpdated.addListener(checkTabs);

// function checkTabs() {
//     // Step 1: Remove duplicate tabs
//     removeDuplicateTabs(function() {
//         // Step 2: After duplicates are removed, check for the tab limit
//         checkTabLimit();
//     });
// }