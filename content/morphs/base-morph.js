// content/morphs/base-morph.js
window.BaseMorph = class BaseMorph {
  constructor(parameters = {}) {
    this.parameters = parameters;
    this.appliedStyles = [];
    this.appliedClasses = [];
  }

  async apply() {
    throw new Error("apply() must be implemented by subclass");
  }

  async revert() {
    throw new Error("revert() must be implemented by subclass");
  }

  // Utility method for injecting CSS safely
  injectCSS(cssString) {
    const styleEl = document.createElement('style');
    styleEl.textContent = cssString;
    styleEl.className = 'easyview-morph-style';
    document.head.appendChild(styleEl);
    this.appliedStyles.push(styleEl);
  }

  // Utility to clear injected CSS
  clearInjectedCSS() {
    this.appliedStyles.forEach(el => el.remove());
    this.appliedStyles = [];
  }
};
