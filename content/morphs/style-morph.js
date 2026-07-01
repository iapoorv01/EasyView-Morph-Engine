// content/morphs/style-morph.js

window.StyleMorph = class StyleMorph extends window.BaseMorph {
  constructor(parameters = {}) {
    super(parameters);
    this.templateCSS = parameters.templateCSS;
    this.styleElement = null;
  }

  async apply() {
    if (!this.templateCSS) {
      console.warn("StyleMorph: No templateCSS provided.");
      return false;
    }

    this.styleElement = document.createElement('style');
    this.styleElement.className = 'easyview-style-morph';
    this.styleElement.textContent = this.templateCSS;
    document.head.appendChild(this.styleElement);

    console.log("[Morph Engine V2] StyleMorph applied successfully!");
    console.log("[Morph Engine V2] Injected CSS:\n", this.templateCSS);
    return true;
  }

  async revert() {
    if (this.styleElement && this.styleElement.parentNode) {
      this.styleElement.parentNode.removeChild(this.styleElement);
      this.styleElement = null;
    }
    
    console.log("[Morph Engine V2] StyleMorph reverted.");
    return true;
  }
};
