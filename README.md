# Chrome-Tabs-managment
chrome overload tabs management extensi# Chrome Tabs Manager Extension

## Overview
**Chrome Tabs Manager** is a simple, user-friendly Chrome extension designed to help users manage their tabs more efficiently.
This documentation will guide you through the installation, usage, and customization of the extension.

---

## Features

1. **Scan and Delete Duplicate Tabs**  
   The extension scans all open tabs for duplicate URLs and automatically closes tabs with identical URLs, keeping only the most recent one.

2. **Set a Tab Limit**  
   Users can set a maximum number of open tabs. When the limit is exceeded, the extension will notify the user and allow them to manage excess tabs.

3. **Handle Exceeding Tab Limit**  
   When the tab limit is exceeded, the extension helps by identifying the oldest tabs. Users can choose whether to close or save them for later use.

4. **Save Tabs**  
   The extension allows users to save the URLs of important tabs they wish to keep without leaving them open. Users can later restore these saved tabs when needed.

5. **Group Similar Tabs**  
   Tabs with similar base URLs (e.g., from the same domain) are automatically grouped, making it easier to manage related tabs.

6. **Search Saved Tabs**  
   A search feature allows users to quickly find saved tabs based on keywords or URLs.

---

## How the Extension Works

### 1. **Scan and Delete Duplicate Tabs**

The extension automatically detects duplicate tabs by comparing the URLs of all open tabs. When duplicates are found, the extension closes them, keeping only the most recently opened tab.

**Steps:**
- Open multiple tabs in your Chrome browser.
- The extension automatically checks for duplicates in real-time.
- If a duplicate is found, it will be closed.
  
### 2. **Set a Tab Limit**

Users can set a maximum number of open tabs through the extension’s settings page. Once this limit is exceeded, the user will be notified, and the extension will provide options to manage tabs.

**Steps:**
- Click on the extension icon.
- Go to the settings page.
- Set a maximum number of open tabs.

### 3. **Handle Exceeding Tab Limit**

If the number of open tabs exceeds the limit, the extension will notify you. It will provide options to close the oldest tabs or save them for later. Tabs that are closed can be saved to local storage for future restoration.

**Steps:**
- When the tab limit is exceeded, a notification will appear.
- The extension will identify and display the oldest tabs.
- Choose which tabs to close or save.

### 4. **Save Tabs**

The extension allows you to save URLs of tabs that you wish to keep for later. These saved tabs will not remain open but can be accessed later through the extension’s interface.

**Steps:**
- When prompted to close tabs, select "Save" instead of "Close."
- The URLs of saved tabs will be stored in local storage.
- You can restore these saved tabs later using the extension.

### 5. **Group Similar Tabs**

The extension groups tabs from the same domain together. This makes it easier to manage similar tabs, allowing you to bulk-close or save them.

**Steps:**
- Open multiple tabs from the same domain.
- The extension will group them together automatically.
- Manage them as a group (e.g., close or save).

### 6. **Search Saved Tabs**

Users can search through saved tabs using a keyword or URL. This feature is accessible through the extension's interface.

**Steps:**
- Open the extension popup.
- Use the search bar to find saved tabs by keyword or URL.

---

## Installation

### **From the Chrome Web Store (Recommended)**

1. Visit the [Chrome Web Store](https://chrome.google.com/webstore) and search for "Chrome Tabs Manager."
2. Click "Add to Chrome."
3. Confirm by clicking "Add Extension."
4. The extension will now be available in your Chrome browser, and you can access it by clicking on the extension icon.

### **From Source (Developer Installation)**

1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/chrome-tabs-manager.git

