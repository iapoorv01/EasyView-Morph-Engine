// content/morphs/youtube-shorts.js
/**
 * Morph: Hide YouTube Shorts
 * Removes all Shorts shelves, sidebar links, and navigation items.
 */

class HideYouTubeShortsMorph extends window.BaseMorph {
  constructor(parameters) {
    super(parameters);
  }

  async apply() {
    if (!window.location.hostname.includes('youtube.com')) {
      console.warn("Hide YouTube Shorts is only applicable on youtube.com");
      return false;
    }

    const css = `
      /* Hide Shorts shelf in home feed */
      ytd-rich-section-renderer.style-scope.ytd-rich-grid-renderer {
        display: none !important;
      }
      /* Hide Shorts link in side navigation */
      ytd-guide-entry-renderer a[title="Shorts"] {
        display: none !important;
      }
      ytd-mini-guide-entry-renderer[aria-label="Shorts"] {
        display: none !important;
      }
      /* Hide Shorts tab on channel pages */
      yt-tab-shape[tab-title="Shorts"] {
        display: none !important;
      }
      /* Hide Shorts button in bottom navigation on mobile/narrow screens */
      yt-navigation-bar-item[label="Shorts"] {
        display: none !important;
      }
    `;

    this.injectCSS(css);
    console.log("[Morph] YouTube Shorts hidden.");
    return true;
  }

  async revert() {
    this.clearInjectedCSS();
    console.log("[Morph] YouTube Shorts restored.");
    return true;
  }
}

// Register with Engine
if (window.morphEngine) {
  window.morphEngine.registerMorph('hide-youtube-shorts', HideYouTubeShortsMorph);
} else {
  // Defer registration if engine isn't ready
  document.addEventListener('MorphEngineReady', () => {
    window.morphEngine.registerMorph('hide-youtube-shorts', HideYouTubeShortsMorph);
  });
}
