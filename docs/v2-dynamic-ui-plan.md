# V2 Dynamic UI Morphing Plan: The "Seamless Replacement" Strategy

## Objective
Enable users to fundamentally alter the layout, styling, and interaction model of complex web applications (e.g., turning a vertical infinite-scroll feed into a paginated newspaper UI) using natural language prompts. Crucially, this must be done **without breaking the site's underlying functionality** (data fetching, React/Angular state, event handlers).

## The Core Concept
Modern web frameworks (like React) will crash if we arbitrarily delete or deeply mutate their DOM elements. To safely "change the main UI," we use a **Data-Driven Shadow Overlay**:
1. **Hide, Don't Delete**: Visually hide the original UI components so they remain active in the DOM.
2. **Inject a Shadow UI**: Render the user's requested layout in a custom Shadow DOM exactly where the old UI was, making it look and feel natively integrated.
3. **Proxy Actions**: Secretly map clicks and interactions from our new UI to the hidden original UI.
4. **Sync State**: Watch the hidden original UI for data changes (like new posts loading) and update our custom UI to match.

---

## Step-by-Step Implementation Plan

### ✅ Step 1: The Context Extractor (DOM Scanner) [COMPLETED]
Before the AI can modify a site, it needs to understand what's there. We need a script that generates a lightweight "map" of the current page.
*   **Action**: Create `content/engine/dom-scanner.js`.
*   **Logic**:
    *   Traverse the main content areas of the page.
    *   Extract semantic tags, classes, ARIA labels, and sample text content.
    *   Filter out heavy SVG paths, deeply nested irrelevant divs, and scripts to keep the payload small.
    *   Output a simplified JSON tree representing the UI's structure.

### ✅ Step 2: The LLM Brain (Prompting & Schema) [COMPLETED]
We will connect the extension to an LLM (e.g., Gemini) via the background service worker. The LLM will receive the user's prompt and the DOM map, and return a strict JSON instruction set.
*   **Action**: Update `background/service_worker.js` to handle API calls.
*   **JSON Schema Expected from LLM**:
    ```json
    {
      "morphType": "shadow-replacement",
      "targetContainer": ".feed-shared-update-v2", // The element to "replace"
      "templateHTML": "<div class='newspaper-layout'>...</div>",
      "templateCSS": ".newspaper-layout { display: grid; ... }",
      "dataBindings": {
        "author-name-id": ".update-components-actor__name",
        "post-content-id": ".update-components-text"
      },
      "actionProxies": {
        "like-btn-id": ".react-button__trigger"
      }
    }
    ```

### Step 3: The `ShadowMorph` Execution Class
This is the new engine component that actually manipulates the page based on the LLM's JSON.
*   **Action**: Create `content/morphs/shadow-morph.js` (extending `BaseMorph`).
*   **Execution Flow**:
    1.  **Hide Original**: Apply `visibility: hidden; position: absolute; height: 0; overflow: hidden;` to the `targetContainer`. It is now invisible and takes up no space, but React still thinks it's there.
    2.  **Mount Shadow Host**: Inject a new `<div>` immediately after the hidden target container and attach a `ShadowRoot` to it. This guarantees our custom CSS (`templateCSS`) won't mess up the rest of the site, and the site's CSS won't mess up our custom UI.
    3.  **Render & Bind**: Inject `templateHTML`. Read the text/images from the selectors defined in `dataBindings` and populate our custom HTML.
    4.  **Attach Proxies**: Add `click` listeners to our custom buttons defined in `actionProxies`. When clicked, our script executes `.click()` on the original hidden elements.

### Step 4: The Data Sync Observer
If the user scrolls down and the website fetches more posts, our custom UI needs to know.
*   **Action**: Implement `MutationObserver` within `ShadowMorph`.
*   **Logic**: Watch the parent container of the hidden original UI. If a new `.feed-shared-update-v2` node is added by the website, automatically extract its data, apply the template, and append it to our custom Newspaper view.

### Step 5: UI & Popup Wiring
Connect the frontend popup to the new background/content script flow.
*   **Action**: Update `popup.js` to send the prompt to the background script, show a loading animation (since LLM calls take a few seconds), and display success/error states based on the engine's response.

---

## Why this approach is powerful:
*   **Safe**: We never fight the website's native JavaScript or React state.
*   **Seamless**: By inserting the Shadow DOM exactly where the old element was, the new UI feels like the actual main UI.
*   **Limitless**: Since the LLM generates raw HTML/CSS for the Shadow DOM, the user can literally request *any* aesthetic or layout (3D, newspaper, terminal-style, etc.) as long as the data maps correctly.
