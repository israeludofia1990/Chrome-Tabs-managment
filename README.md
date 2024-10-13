# Chrome-Tabs-managment
chrome overload tabs management extension

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

### **Scan and Delete Duplicate Tabs**

This feature helps you manage your browser by automatically closing duplicate tabs that have the same URL. Here's a simple breakdown of how it works:

1. **Subdomain Handling**  
   The extension ignores subdomains like `www` or `m` when comparing URLs, so `www.example.com` and `example.com` are treated as the same.

2. **URL Cleanup**  
   It removes extra parts of the URL that don’t change the page content, like tracking info (`utm_source`) or fragments (`#section`). For example, `https://www.example.com/page?utm_source=google#section` becomes `https://example.com/page`.

3. **Removing Duplicates**  
   The extension looks at all your open tabs and closes any with the same cleaned-up URL, except for the active tab or pinned tabs.

4. **User Notification**  
   If duplicates are closed, you’ll get a notification telling you how many were removed.

5. **Automatic Check**  
   This process runs automatically when a tab finishes loading, so your tabs stay tidy without extra effort.

   **Example**  
   If you have these three tabs open:
   - `https://www.example.com/page`
   - `https://example.com/page?utm_source=facebook`
   - `https://example.com/page`

   The extension will see these as duplicates and keep only one tab open.

  
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

**

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
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer Mode**.
4. Click on **Load unpacked** and select the extension folder.
5. The extension will be added to your browser.

---

## Usage

1. After installation, access the extension from the Chrome toolbar.
2. Use the settings interface to:
   - Set a tab limit.
   - Save or manage your tabs.
   - Search for saved tabs.
   - Group or close tabs from the same domain.

---

## Testing the Extension

To run unit tests for various features (e.g., removing duplicates, setting tab limits):
1. Clone the repository.
2. Run the provided test scripts using your preferred testing framework (e.g., Jest or Mocha).
3. Ensure all tests pass before deploying any changes.

---

## Contribution Guidelines

We welcome contributions! Here’s how you can contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and write unit tests.
4. Submit a pull request with a detailed description of your changes.
5. Wait for a review before the changes are merged.

---
