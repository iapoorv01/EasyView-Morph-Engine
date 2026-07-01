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

  const systemPrompt = `You are a UI morphing engine. You take a user's natural language prompt and a simplified DOM map of a website, and you return a strict JSON object that tells the engine how to rebuild or restyle the UI.

The JSON schema must EXACTLY match ONE of the following formats based on the best approach:

Format 1 (For completely replacing or rebuilding UI components):
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

Format 2 (For global styling changes like dark/light mode, font changes, color changes, etc. without rebuilding the DOM):
{
  "morphType": "style-injection",
  "templateCSS": "<css_string_to_inject_globally>"
}

Important Rules:
1. If the user asks for a global style change (like "light theme" or "anime background"), ALWAYS use Format 2 ("style-injection"). DO NOT rebuild the page using shadow-replacement for simple styling.
2. For Format 2 ("style-injection"): You have full creative control over the injected CSS. If the user wants a background image, use public image APIs. DO NOT use source.unsplash.com as it is permanently deprecated and returns 404 errors. Use valid alternatives like picsum.photos (e.g., https://picsum.photos/1920/1080). It is your responsibility to handle CSS specificity and override existing site styles (e.g., using \`!important\`, targeting \`html\` or \`body\`, and aggressively making wrappers transparent to ensure your background is visible).
3. For Format 1 ("shadow-replacement"): "targetContainer" must be a valid CSS selector found in the DOM map. In "templateHTML", use standard HTML and assign unique IDs. "dataBindings" and "actionProxies" map the new IDs to the original selectors.
4. Provide ONLY the JSON. No markdown formatting, no backticks.
`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: `Website DOM Map:\n${JSON.stringify(domMap)}` },
            { text: systemPrompt },
            { text: `User Prompt: ${prompt}\n\nPlease generate the JSON response.` }
          ]
        }]
      })
    });

    const data = await response.json();

    console.log("[Morph Engine Background] Raw Gemini API Response:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch from Gemini API');
    }

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.error("[Morph Engine Background] Unexpected API response structure:", data);
      throw new Error("Unexpected response structure from Gemini API");
    }

    let responseText = data.candidates[0].content.parts[0].text;
    console.log("[Morph Engine Background] Raw response text:", responseText);

    // Clean up markdown block if present
    responseText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
    console.log("[Morph Engine Background] Cleaned response text:", responseText);

    const instructions = JSON.parse(responseText);
    console.log("[Morph Engine Background] Parsed JSON Instructions:", instructions);

    return instructions;

  } catch (err) {
    console.error("[Morph Engine Background] Morph Request Error:", err);
    throw new Error(err.message || "The AI returned an invalid schema or encountered an error.");
  }
}
