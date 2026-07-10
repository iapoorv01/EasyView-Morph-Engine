// content/morphs/style-morph.js

// content/morphs/style-morph.js

window.StyleMorph = class StyleMorph extends window.BaseMorph {
  constructor(parameters = {}) {
    super(parameters);
    this.templateCSS = parameters.templateCSS;
  }

  async apply() {
    if (!this.templateCSS) {
      console.warn("StyleMorph: No templateCSS provided.");
      return false;
    }

    this.injectCSS(this.templateCSS);

    console.log("[Morph Engine V2] StyleMorph applied successfully!");
    console.log("[Morph Engine V2] Injected CSS:\n", this.templateCSS);
    return true;
  }

  async revert() {
    this.clearInjectedCSS();
    console.log("[Morph Engine V2] StyleMorph reverted.");
    return true;
  }
};
