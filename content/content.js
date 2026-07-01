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
    } else if (request.action === 'EXECUTE_DYNAMIC_MORPH') {
      handleDynamicMorphExecution(request.payload.prompt)
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

  // V2 Dynamic Morph Pipeline
  async function handleDynamicMorphExecution(prompt) {
    console.log(`[Morph Engine V2] Received prompt: "${prompt}"`);

    // 1. Scan DOM
    const domMap = window.domScanner.scan();
    console.log(`[Morph Engine V2] DOM Scanned. Sending to LLM via background worker...`);

    // 2. Ask Background (LLM) for instructions
    const instructions = await new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({
        action: "morphRequest",
        prompt: prompt,
        domMap: domMap
      }, response => {
        if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
        else if (response && response.error) reject(new Error(response.error));
        else resolve(response);
      });
    });

    console.log(`[Morph Engine V2] Received schema from LLM:`, instructions);

    // Validate LLM Response Pipeline
    if (!instructions || typeof instructions !== 'object') {
      console.error("[Morph Engine V2] Validation Failed: LLM response is not a valid object", instructions);
      throw new Error("Invalid AI response format.");
    }

    if (instructions.morphType !== "shadow-replacement" && instructions.morphType !== "style-injection") {
      console.error("[Morph Engine V2] Validation Failed: Unsupported morphType", instructions.morphType);
      throw new Error(`Unsupported morphType: ${instructions.morphType}`);
    }

    try {
      let activeMorph;
      
      // 3. Execute Morph
      if (instructions.morphType === "shadow-replacement") {
        activeMorph = new window.ShadowMorph(instructions);
      } else if (instructions.morphType === "style-injection") {
        activeMorph = new window.StyleMorph(instructions);
      }
      
      await activeMorph.apply();
      
      // Register it in the engine so it can be reverted
      const morphId = `dynamic_morph_${Date.now()}`;
      
      if (!window.morphEngine || !window.morphEngine.activeMorphs) {
         console.error("[Morph Engine V2] window.morphEngine.activeMorphs is undefined. Engine state might be corrupted.");
         throw new Error("Engine state corrupted. Please refresh the page.");
      }
      
      window.morphEngine.activeMorphs.set(morphId, activeMorph);
      console.log(`[Morph Engine V2] Morph ${morphId} registered successfully.`);
    } catch (error) {
      console.error("[Morph Engine V2] Runtime error during morph application:", error);
      throw error;
    }
  }
})();
