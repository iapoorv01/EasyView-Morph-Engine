// content/content.js
/**
 * EasyView Morph Engine - Content Script Entry Point
 * Initializes the engine and listens for popup messages.
 */

(function init() {
  if (window.morphEngineInitialized) return;
  window.morphEngineInitialized = true;

  console.log("EasyView Morph Engine: Content script injected.");

  // Initialize Core Systems
  window.morphEngine = new window.MorphEngine();
  window.intentProcessor = new window.MorphIntentProcessor();
  window.domScanner = new window.MorphDOMScanner();

  // Dispatch event so morphs can register themselves
  document.dispatchEvent(new Event('MorphEngineReady'));

  // Listen for messages from the popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'EXECUTE_MORPH') {
      handleMorphExecution(request.payload.prompt)
        .then(() => sendResponse({ success: true }))
        .catch(err => {
          console.error(err);
          sendResponse({ success: false, error: err.message });
        });
      return true; // Keep message channel open for async response
    } else if (request.action === 'RESET_PAGE') {
      window.morphEngine.resetAll()
        .then(() => sendResponse({ success: true }))
        .catch(err => {
          console.error(err);
          sendResponse({ success: false, error: err.message });
        });
      return true;
    }
  });

  async function handleMorphExecution(prompt) {
    console.log(`[Morph Engine] Received prompt: "${prompt}"`);
    
    // 1. Process Intent
    const intent = await window.intentProcessor.processPrompt(prompt);
    console.log(`[Morph Engine] Intent identified:`, intent);

    if (intent.morphId === 'unknown') {
      alert(`EasyView Morph Engine (V1):\n\nSorry, I couldn't understand that prompt. Try "Study Mode" or "Hide YouTube Shorts".`);
      return;
    }

    // 2. Execute Transformation
    const success = await window.morphEngine.executeMorph(intent.morphId, intent.parameters);
    
    if (!success) {
      alert(`EasyView Morph Engine:\n\nFailed to apply morph. It might not be supported on this website.`);
    }
  }
})();
