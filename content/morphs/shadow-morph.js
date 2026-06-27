// content/morphs/shadow-morph.js

window.ShadowMorph = class ShadowMorph extends window.BaseMorph {
  constructor(parameters = {}) {
    super(parameters);
    this.targetContainerSelector = parameters.targetContainer;
    this.templateHTML = parameters.templateHTML;
    this.templateCSS = parameters.templateCSS;
    this.dataBindings = parameters.dataBindings || {};
    this.actionProxies = parameters.actionProxies || {};

    this.originalContainer = null;
    this.originalStyles = {};
    this.shadowHost = null;
  }

  async apply() {
    this.originalContainer = document.querySelector(this.targetContainerSelector);
    if (!this.originalContainer) {
      console.warn(`ShadowMorph: Target container ${this.targetContainerSelector} not found.`);
      return;
    }

    // 1. Hide Original safely
    this.originalStyles = {
      visibility: this.originalContainer.style.visibility,
      position: this.originalContainer.style.position,
      height: this.originalContainer.style.height,
      overflow: this.originalContainer.style.overflow
    };

    this.originalContainer.style.visibility = 'hidden';
    this.originalContainer.style.position = 'absolute';
    this.originalContainer.style.height = '0';
    this.originalContainer.style.overflow = 'hidden';

    // 2. Mount Shadow Host
    this.shadowHost = document.createElement('div');
    this.shadowHost.className = 'easyview-shadow-morph-host';
    
    // Insert immediately after the hidden target container
    this.originalContainer.parentNode.insertBefore(this.shadowHost, this.originalContainer.nextSibling);
    
    const shadowRoot = this.shadowHost.attachShadow({ mode: 'open' });

    // Inject CSS
    const styleEl = document.createElement('style');
    styleEl.textContent = this.templateCSS;
    shadowRoot.appendChild(styleEl);

    // 3. Render & Bind
    const contentWrapper = document.createElement('div');
    contentWrapper.innerHTML = this.templateHTML;
    shadowRoot.appendChild(contentWrapper);

    // Bind data from original elements to our custom HTML
    for (const [newId, oldSelector] of Object.entries(this.dataBindings)) {
      const newEl = shadowRoot.getElementById(newId);
      const oldEl = this.originalContainer.querySelector(oldSelector);
      
      if (newEl && oldEl) {
        if (oldEl.tagName === 'IMG' && newEl.tagName === 'IMG') {
          newEl.src = oldEl.src;
        } else {
          newEl.innerHTML = oldEl.innerHTML;
        }
      }
    }

    // 4. Attach Proxies
    for (const [newId, oldSelector] of Object.entries(this.actionProxies)) {
      const newBtn = shadowRoot.getElementById(newId);
      if (newBtn) {
        newBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          const oldBtn = this.originalContainer.querySelector(oldSelector);
          if (oldBtn) {
            oldBtn.click();
          } else {
            console.warn(`ShadowMorph: Action proxy target ${oldSelector} not found.`);
          }
        });
      }
    }

    console.log(`ShadowMorph applied on ${this.targetContainerSelector}.`);
  }

  async revert() {
    // Restore original visibility
    if (this.originalContainer) {
      this.originalContainer.style.visibility = this.originalStyles.visibility;
      this.originalContainer.style.position = this.originalStyles.position;
      this.originalContainer.style.height = this.originalStyles.height;
      this.originalContainer.style.overflow = this.originalStyles.overflow;
    }

    // Remove the custom shadow host
    if (this.shadowHost) {
      this.shadowHost.remove();
      this.shadowHost = null;
    }

    console.log(`ShadowMorph reverted on ${this.targetContainerSelector}.`);
  }
};
