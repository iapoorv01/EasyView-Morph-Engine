// content/morphs/senior-mode.js
/**
 * Universal Morph: Senior Mode
 * Works on ALL websites. 
 * Increases font sizes globally, ensures high contrast, simplifies links/buttons,
 * and removes complex sticky headers.
 */

class SeniorModeMorph extends window.BaseMorph {
  constructor(parameters) {
    super(parameters);
  }

  async apply() {
    const css = `
      /* Universal Typography & Contrast Override */
      body.easyview-senior-mode * {
        font-family: 'Arial', sans-serif !important;
        font-size: 110% !important; /* Scale up all text */
        color: #000000 !important; /* Maximum contrast text */
        line-height: 1.8 !important;
        letter-spacing: 0.5px !important;
      }
      
      body.easyview-senior-mode {
        background-color: #ffffff !important; /* Pure white background */
      }

      /* Make links and buttons extremely obvious */
      body.easyview-senior-mode a {
        text-decoration: underline !important;
        text-underline-offset: 4px !important;
        color: #0000EE !important; /* Classic bright blue link */
        font-weight: bold !important;
      }

      body.easyview-senior-mode button,
      body.easyview-senior-mode [role="button"] {
        border: 2px solid #0000EE !important;
        padding: 8px 16px !important;
        background: #f0f8ff !important;
        color: #0000EE !important;
        font-weight: bold !important;
        border-radius: 4px !important;
      }

      /* Un-stick headers so they don't block the screen */
      body.easyview-senior-mode [style*="position: fixed"],
      body.easyview-senior-mode [style*="position: sticky"],
      body.easyview-senior-mode header {
        position: relative !important; 
      }
      
      /* Make inputs larger */
      body.easyview-senior-mode input, 
      body.easyview-senior-mode textarea {
        font-size: 20px !important;
        padding: 10px !important;
        border: 2px solid #333 !important;
      }
    `;

    this.injectCSS(css);
    document.body.classList.add('easyview-senior-mode');

    console.log("[Morph] Senior Mode (Universal) applied.");
    return true;
  }

  async revert() {
    this.clearInjectedCSS();
    document.body.classList.remove('easyview-senior-mode');
    console.log("[Morph] Senior Mode reverted.");
    return true;
  }
}

// Register
if (window.morphEngine) {
  window.morphEngine.registerMorph('senior-mode', SeniorModeMorph);
} else {
  document.addEventListener('MorphEngineReady', () => {
    window.morphEngine.registerMorph('senior-mode', SeniorModeMorph);
  });
}
