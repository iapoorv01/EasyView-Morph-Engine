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

// Listen for messages from the popup or content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "morphRequest") {
    handleMorphRequest(request.prompt, request.domMap)
      .then(response => sendResponse(response))
      .catch(error => sendResponse({ error: error.message }));
    return true; // Indicates asynchronous response
  }
});

/**
 * Handles the morph request by interacting with the LLM (Gemini).
 * Receives the user's prompt and the simplified DOM map.
 * Returns a strict JSON instruction set for the ShadowMorph execution class.
 */
async function handleMorphRequest(prompt, domMap) {
  console.log("Received morph request.");
  console.log("Prompt:", prompt);
  console.log("DOM Map Size:", JSON.stringify(domMap).length, "bytes");

  // TODO: Replace this mock implementation with actual Gemini API fetch logic
  // e.g., fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=YOUR_API_KEY', ...)

  // Simulating network delay for LLM processing
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Returning a mocked strict JSON instruction set matching the V2 schema
  return {
    morphType: "shadow-replacement",
    targetContainer: ".feed-shared-update-v2", // Example target
    templateHTML: `
      <div class='newspaper-layout'>
        <div class='newspaper-header'>
          <h3 id='author-name-id'>Author</h3>
          <button id='like-btn-id'>Like</button>
        </div>
        <div id='post-content-id' class='newspaper-content'></div>
      </div>
    `,
    templateCSS: `
      .newspaper-layout {
        font-family: 'Times New Roman', Times, serif;
        border: 2px solid #333;
        padding: 15px;
        margin-bottom: 20px;
        background-color: #f9f7f1;
        color: #111;
        box-shadow: 2px 2px 5px rgba(0,0,0,0.1);
      }
      .newspaper-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #333;
        padding-bottom: 10px;
        margin-bottom: 10px;
      }
      .newspaper-content {
        line-height: 1.6;
      }
      #like-btn-id {
        background: #333;
        color: #fff;
        border: none;
        padding: 5px 10px;
        cursor: pointer;
      }
      #like-btn-id:hover {
        background: #555;
      }
    `,
    dataBindings: {
      "author-name-id": ".update-components-actor__name",
      "post-content-id": ".update-components-text"
    },
    actionProxies: {
      "like-btn-id": ".react-button__trigger"
    }
  };
}
