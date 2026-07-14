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

  const systemPrompt = `You are an autonomous UI morphing AI agent living directly inside the user's web browser as an extension. You take a user's natural language prompt and a simplified DOM map of the live website they are currently viewing, and you return a strict JSON object that tells the engine how to instantly rebuild, restyle, or orchestrate the UI dynamically. Act accordingly as a client-side browser extension (no server-side logic).

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

Format 3 (For arbitrary dynamic functionality, like adding sounds, particles, fetching external media, or injecting custom DOM elements sequentially):
{
  "morphType": "dynamic-action",
  "templateCSS": "<your_custom_keyframes_and_classes_here>",
  "actions": [
    { "command": "createElement", "tag": "audio", "id": "my-audio", "attributes": { "src": "<url>", "autoplay": "true", "loop": "true" } },
    { "command": "appendChild", "parentId": "body", "targetId": "my-audio" },
    { "command": "setStyle", "targetSelector": "body", "styles": { "overflow": "hidden" } }
  ]
}
Supported commands for Format 3:
- "createElement" (requires "tag", optional "id", "attributes" object, "styles" object, "innerHTML")
- "appendChild" (requires "parentId" like "body" or a selector, and "targetId" referring to a created element ID, or "targetSelector")
- "setStyle" (requires "targetId" or "targetSelector", and "styles" object)
- "removeElement" (requires "targetSelector")

Important Rules:
1. If the user asks for ONLY a global style change (like "light theme" or "anime background"), use Format 2 ("style-injection"). DO NOT rebuild the page using shadow-replacement for simple styling.
2. If the user asks for dynamic functionality (like SOUNDS, video injection, sequential DOM building) OR a combination of styles and dynamic functionality, ALWAYS use Format 3 ("dynamic-action"). Format 3's array of actions allows you to combine multiple setStyle and createElement commands in one go.
3. For Format 2 AND Format 3 styling: You have full creative control over the injected CSS. For background images, you MUST use https://picsum.photos (e.g., https://picsum.photos/seed/anime/1920/1080). DO NOT use source.unsplash.com. To ensure your background is visible, DO NOT set it on the body; instead, use 'createElement' to create a fixed full-screen div (z-index: -9999, top:0, left:0, width:100vw, height:100vh) holding the background image, and aggressively make the html, body, and ALL structural wrapper divs transparent (!important).
4. CRITICAL - DYNAMIC READABILITY: When you change backgrounds or make wrappers transparent, YOU MUST ensure the page text remains readable. Always dynamically adjust text colors and add heavy text-shadows (e.g., text-shadow: 1px 1px 3px rgba(0,0,0,0.8)). DO NOT add background colors, margins, paddings, or borders to structural elements (like section, div, footer) to improve readability, as this destroys the original website layout.
5. WEATHER/VISUAL EFFECTS: If the user asks for rain, snow, or other effects, use 'createElement' to generate individual particle divs (e.g. 10-20 raindrops) and use 'templateCSS' for an @keyframes falling animation. Ensure overlays have 'pointer-events: none!important' and particles explicitly have 'top: -50px' (or similar) IN THEIR BASE CSS CLASS (e.g. .raindrop) so they don't default to the bottom of the screen. CRITICAL !IMPORTANT RULES: 1. NEVER use !important inside @keyframes. 2. NEVER use !important on the 'animation' property in your classes (e.g. use exactly 'animation: fall linear infinite;' without !important) because it will override inline animationDelays. 3. NEVER use !important on properties that change during the animation (like opacity or transform) in the base class. 4. NEVER use invalid uncalculated math like translateY(100vh + 50px). Always use simple values like translateY(110vh).
6. For Audio/Video: Always use reliable, true CORS-friendly public URLs. DO NOT hallucinate URLs (like nasa.gov). Instead, strictly use real audio URLs from Google's sound library (e.g., https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg). You may use .ogg files. DO NOT use 'file-examples.com', 'pixabay.com', or 'mixkit.co'.
7. CSS SELECTORS: You are looking at a simplified JSON representation of the DOM. Do NOT use JSON keys as CSS selectors (e.g. NEVER use \`[children][0]\` or \`[tag='div']\`). You MUST use standard, valid CSS selectors like \`.class-name\`, \`#id\`, or \`body > div:nth-child(2)\`.
8. For Format 1 ("shadow-replacement"): "targetContainer" must be a valid CSS selector found in the DOM map. In "templateHTML", use standard HTML and assign unique IDs. "dataBindings" and "actionProxies" map the new IDs to the original selectors.
9. AUTONOMY & PERFORMANCE: Understand the semantic nature of the site's DOM map. If the user gives a vague or poorly phrased prompt, intelligently interpret their underlying intent. Adapt your changes to fit seamlessly without breaking the site's core layout or functionality. Ensure your animations and visual effects are highly optimized (use hardware-accelerated CSS properties like transform and opacity) and do not cause browser lag.
10. Provide ONLY valid JSON. No markdown formatting, no backticks. CRITICAL: JSON strings cannot contain literal unescaped newlines. You MUST write all CSS in 'templateCSS' on a single continuous line, or properly escape newlines as \\n.
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
        }],
        generationConfig: {
          responseMimeType: "application/json"
        }
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

    // Robust cleanup: extract from first { to last } to prevent trailing brace errors
    const firstBrace = responseText.indexOf('{');
    const lastBrace = responseText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      responseText = responseText.substring(firstBrace, lastBrace + 1);
    }

    console.log("[Morph Engine Background] Cleaned response text:", responseText);

    const instructions = JSON.parse(responseText);
    console.log("[Morph Engine Background] Parsed JSON Instructions:", instructions);

    return instructions;

  } catch (err) {
    console.error("[Morph Engine Background] Morph Request Error:", err);
    throw new Error(err.message || "The AI returned an invalid schema or encountered an error.");
  }
}
