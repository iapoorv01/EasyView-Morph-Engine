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

    // 5. Data Sync Observer (Step 4)
    this.setupObserver();
    
    return true;
  }

  updateBindings(shadowRoot) {
    for (const [newId, oldSelector] of Object.entries(this.dataBindings)) {
      const newEl = shadowRoot.getElementById(newId);
      const oldEl = this.originalContainer.querySelector(oldSelector);
      
      if (newEl && oldEl) {
        if (oldEl.tagName === 'IMG' && newEl.tagName === 'IMG') {
          if (newEl.src !== oldEl.src) newEl.src = oldEl.src;
        } else {
          if (newEl.innerHTML !== oldEl.innerHTML) newEl.innerHTML = oldEl.innerHTML;
        }
      }
    }
  }

  setupObserver() {
    if (!this.originalContainer || !this.shadowHost) return;

    // Watch the parent of the original container for new sibling nodes (like new posts in a feed)
    // and watch the original container itself for internal data changes.
    this.observer = new MutationObserver((mutations) => {
      let needsSync = false;
      for (const mutation of mutations) {
        if (mutation.type === 'childList' || mutation.type === 'characterData' || mutation.type === 'attributes') {
          needsSync = true;
          break;
        }
      }

      if (needsSync) {
        this.updateBindings(this.shadowHost.shadowRoot);
      }
    });

    // Observe both the container and its parent (in case new elements of the same selector are appended)
    this.observer.observe(this.originalContainer, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true
    });
    
    if (this.originalContainer.parentNode) {
      this.observer.observe(this.originalContainer.parentNode, {
        childList: true
      });
    }

    console.log(`ShadowMorph Observer attached for ${this.targetContainerSelector}.`);
  }

  async revert() {
    // Disconnect observer
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

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
    return true;
  }
};
