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

  const { geminiApiKey } = await chrome.storage.sync.get(['geminiApiKey']);

  if (!geminiApiKey) {
    throw new Error('API Key missing. Please set your Gemini API Key in the extension options (Right click icon -> Options).');
  }

  const systemPrompt = `You are a UI morphing engine. You take a user's natural language prompt and a simplified DOM map of a website, and you return a strict JSON object that tells the ShadowMorph engine how to rebuild the UI.

The JSON schema must EXACTLY match:
{
  "morphType": "shadow-replacement",
  "targetContainer": "<css_selector_of_the_element_to_replace>",
  "templateHTML": "<your_custom_html_here_with_ids>",
  "templateCSS": "<your_custom_css_here>",
  "dataBindings": {
    "<new_id_in_templateHTML>": "<old_css_selector_in_original_container>"
  },
  "actionProxies": {
    "<new_id_in_templateHTML>": "<old_css_selector_in_original_container>"
  }
}

Important Rules:
1. "targetContainer" must be a valid CSS selector found in the DOM map that represents the main container to morph.
2. In "templateHTML", use standard HTML. Assign unique IDs to elements that need data or interactions.
3. "dataBindings" maps the new IDs you created in "templateHTML" to the original CSS selectors inside the "targetContainer". The engine will copy innerHTML or src from the old selector to the new ID.
4. "actionProxies" maps new button IDs to original button selectors so clicks are forwarded.
5. Provide ONLY the JSON. No markdown formatting, no backticks.
`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: systemPrompt },
            { text: `User Prompt: ${prompt}` },
            { text: `DOM Map:\n${JSON.stringify(domMap)}` }
          ]
        }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch from Gemini API');
    }

    let responseText = data.candidates[0].content.parts[0].text;

    // Clean up markdown block if present
    responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

    const instructions = JSON.parse(responseText);
    return instructions;

  } catch (err) {
    console.error("Morph Request Error:", err);
    throw new Error(err.message || "The AI returned an invalid schema or encountered an error.");
  }
}
