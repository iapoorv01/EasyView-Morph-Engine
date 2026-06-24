// background/service_worker.js
// EasyView Morph Engine - Background Service Worker

chrome.runtime.onInstalled.addListener(() => {
  console.log("EasyView Morph Engine installed.");
  // Initialize default profile or settings
  chrome.storage.sync.set({ morphProfile: 'default' });
});

// Future: Handle communication with external AI APIs (e.g. OpenAI/Anthropic)
// Future: Manage global state and history of morphs applied
