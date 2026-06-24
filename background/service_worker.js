// background/service_worker.js

// Initialize Morph Engine context on extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    // Open EasyView landing page on first install
    chrome.tabs.create({ url: 'https://easyview.in' });
  }
  console.log("EasyView Morph Engine Background Service Worker initialized.");
});

// Future V2 Features: Listen for contextMenu clicks, sync profile updates, etc.
