// content/morphs/dynamic-morph.js

window.DynamicMorph = class DynamicMorph extends window.BaseMorph {
  constructor(parameters = {}) {
    super(parameters);
    this.actions = parameters.actions || [];
    this.createdElements = new Map(); // Track created elements for easy cleanup
    this.originalStyles = new Map(); // Track style changes for revert
  }

  async apply() {
    console.log(`[DynamicMorph] Executing ${this.actions.length} dynamic actions.`);

    for (const action of this.actions) {
      try {
        await this.executeAction(action);
      } catch (err) {
        console.error(`[DynamicMorph] Failed to execute action:`, action, err);
      }
    }
    
    console.log(`[DynamicMorph] Successfully applied dynamic actions.`);
  }

  async executeAction(action) {
    switch (action.command) {
      case 'createElement': {
        const el = document.createElement(action.tag);
        if (action.id) {
          el.id = action.id;
        }
        if (action.attributes) {
          for (const [key, value] of Object.entries(action.attributes)) {
            el.setAttribute(key, value);
          }
        }
        if (action.styles) {
          for (const [key, value] of Object.entries(action.styles)) {
            el.style[key] = value;
          }
        }
        if (action.innerHTML) {
          el.innerHTML = action.innerHTML;
        }
        // Store reference for revert
        if (action.id) {
          this.createdElements.set(action.id, el);
        }
        break;
      }

      case 'appendChild': {
        const parent = action.parentId === 'body' ? document.body : (action.parentId === 'head' ? document.head : document.querySelector(action.parentId));
        let child = this.createdElements.get(action.targetId);
        
        if (!child && action.targetSelector) {
           child = document.querySelector(action.targetSelector);
        }

        if (parent && child) {
          parent.appendChild(child);
        } else {
          console.warn(`[DynamicMorph] appendChild failed: parent or child not found.`, action);
        }
        break;
      }

      case 'setStyle': {
        const target = action.targetId ? this.createdElements.get(action.targetId) : document.querySelector(action.targetSelector);
        if (target && action.styles) {
          // Backup original styles before overwriting
          if (!this.originalStyles.has(target)) {
            this.originalStyles.set(target, target.getAttribute('style') || '');
          }
          
          for (const [key, value] of Object.entries(action.styles)) {
            target.style[key] = value;
          }
        }
        break;
      }
      
      case 'removeElement': {
        const target = document.querySelector(action.targetSelector);
        if (target) {
          target.style.display = 'none'; // Safer than actual removal for revert purposes
        }
        break;
      }

      default:
        console.warn(`[DynamicMorph] Unknown command: ${action.command}`);
    }
  }

  async revert() {
    console.log(`[DynamicMorph] Reverting dynamic actions.`);

    // 1. Remove all dynamically created elements
    for (const [id, el] of this.createdElements.entries()) {
      if (el && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    }
    this.createdElements.clear();

    // 2. Restore original styles
    for (const [target, originalStyle] of this.originalStyles.entries()) {
      if (target) {
        target.setAttribute('style', originalStyle);
      }
    }
    this.originalStyles.clear();
    
    console.log(`[DynamicMorph] Revert complete.`);
  }
};
