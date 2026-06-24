// content/morphs/study-mode.js
/**
 * Morph: Study Mode
 * Simplifies layout, removes distractions, increases readability.
 */

class StudyModeMorph extends window.BaseMorph {
  constructor(parameters) {
    super(parameters);
  }

  async apply() {
    // 1. Inject typography and spacing improvements
    const css = `
      body.easyview-study-mode {
        background-color: #FDFBF7 !important; /* Soft warm background */
        color: #333333 !important; /* High contrast text */
        font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
        line-height: 1.6 !important;
      }
      .easyview-study-mode p, 
      .easyview-study-mode article, 
      .easyview-study-mode main,
      .easyview-study-mode .content {
        font-size: 18px !important;
        max-width: 800px !important;
        margin-left: auto !important;
        margin-right: auto !important;
      }
      /* Hide common distraction classes */
      .easyview-study-mode aside,
      .easyview-study-mode .sidebar,
      .easyview-study-mode .advertisement,
      .easyview-study-mode [id*="ad-"],
      .easyview-study-mode .comments,
      .easyview-study-mode .social-share,
      .easyview-study-mode nav {
        display: none !important;
      }
    `;
    this.injectCSS(css);
    
    // 2. Add class to body
    document.body.classList.add('easyview-study-mode');
    
    console.log("[Morph] Study Mode applied.");
    return true;
  }

  async revert() {
    this.clearInjectedCSS();
    document.body.classList.remove('easyview-study-mode');
    console.log("[Morph] Study Mode reverted.");
    return true;
  }
}

// Register
if (window.morphEngine) {
  window.morphEngine.registerMorph('study-mode', StudyModeMorph);
} else {
  document.addEventListener('MorphEngineReady', () => {
    window.morphEngine.registerMorph('study-mode', StudyModeMorph);
  });
}
