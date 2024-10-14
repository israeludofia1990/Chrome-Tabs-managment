 // Receive the closeTabs data from the background script
 chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "loadTabs") {
        const tabList = document.getElementById("tab-list");
        request.tabs.forEach(tab => {
            const li = document.createElement("li");
            li.textContent = tab.title;

            const closeButton = document.createElement("button");
            closeButton.textContent = "Close This Tab";
            closeButton.onclick = () => {
                chrome.tabs.remove(tab.id);
            };

            const saveButton = document.createElement("button");
            saveButton.textContent = "Save This Tab";
            saveButton.onclick = () => {
                saveTab(tab.url);
            };

            li.appendChild(closeButton);
            li.appendChild(saveButton);
            tabList.appendChild(li);
        });
    }
});

document.getElementById("close-all").onclick = () => {
    chrome.runtime.sendMessage({ action: "closeAllTabs" });
};

document.getElementById("save-all").onclick = () => {
    chrome.runtime.sendMessage({ action: "saveAllTabs" });
};

function saveTab(url) {
    chrome.storage.sync.get('savedTabs', function(result) {
        const allSavedTabs = result.savedTabs ? result.savedTabs.concat(url) : [url];
        chrome.storage.sync.set({ savedTabs: allSavedTabs }, function() {
            alert('Tab saved for later!');
        });
    });
}