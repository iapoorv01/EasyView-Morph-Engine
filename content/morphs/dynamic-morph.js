// content/morphs/dynamic-morph.js

window.DynamicMorph = class DynamicMorph extends window.BaseMorph {
  constructor(parameters = {}) {
    super(parameters);
    this.actions = parameters.actions || [];
    this.templateCSS = parameters.templateCSS || null;
    this.createdElements = new Map(); // Track created elements for easy cleanup
    this.modifiedElements = new Set(); // Track modified elements for style revert
    this.originalStyles = new Map(); // Fallback if engine is not there
    this.styleElement = null;
  }

  async apply() {
    console.log(`[DynamicMorph] Executing ${this.actions.length} dynamic actions.`);

    if (this.templateCSS) {
      this.styleElement = document.createElement('style');
      this.styleElement.id = `dynamic-morph-css-${Date.now()}`;
      this.styleElement.textContent = this.templateCSS;
      document.head.appendChild(this.styleElement);
    }

    for (const action of this.actions) {
      try {
        await this.executeAction(action);
      } catch (err) {
        console.error(`[DynamicMorph] Failed to execute action:`, action, err);
      }
    }

    console.log(`[DynamicMorph] Successfully applied dynamic actions.`);
    return true;
  }

  async executeAction(action) {
    switch (action.command) {
      case 'createElement': {
        const el = document.createElement(action.tag);
        if (action.id) {
          el.id = action.id;
        }
        if (action.classes) {
          el.className = action.classes;
        } else if (action.className) {
          el.className = action.className;
        } else if (action.class) {
          el.className = action.class;
        }
        if (action.attributes) {
          for (const [key, value] of Object.entries(action.attributes)) {
            // Handle specific DOM properties that are not just HTML attributes
            if (key === 'volume') {
              el.volume = parseFloat(value);
            } else if (key === 'autoplay' && (value === 'true' || value === true)) {
              el.autoplay = true;
            } else {
              el.setAttribute(key, value);
            }
          }
        }
        if (action.styles) {
          for (let [key, value] of Object.entries(action.styles)) {
            let priority = '';
            if (typeof value === 'string' && value.includes('!important')) {
              priority = 'important';
              value = value.replace('!important', '').trim();
            }
            const kebabKey = key.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`);
            el.style.setProperty(kebabKey, value, priority);
          }
        }
        if (action.innerHTML) {
          el.innerHTML = action.innerHTML;
        }

        // If it's media with autoplay, force play() to handle dynamic injection
        if ((action.tag === 'audio' || action.tag === 'video') && el.autoplay) {
          // Play needs to happen after it's in the DOM, so wait for next tick
          setTimeout(() => {
            el.play().catch(e => {
              console.warn('[DynamicMorph] Autoplay blocked. Waiting for user interaction...', e);
              const playOnInteract = () => {
                el.play().catch(err => console.error("Playback still blocked:", err));
                document.removeEventListener('click', playOnInteract);
                document.removeEventListener('keydown', playOnInteract);
              };
              document.addEventListener('click', playOnInteract);
              document.addEventListener('keydown', playOnInteract);
            });
          }, 100);
        }

        // Store reference for revert
        if (action.id) {
          this.createdElements.set(action.id, el);
        }
        break;
      }

      case 'appendChild': {
        let parent;
        if (action.parentId === 'body') {
          parent = document.body;
        } else if (action.parentId === 'head') {
          parent = document.head;
        } else {
          parent = this.createdElements.get(action.parentId);
          if (!parent) {
            try {
              parent = document.querySelector(action.parentId) || document.querySelector(`#${action.parentId}`);
            } catch (e) { }
          }
        }

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
        let targets = [];
        if (action.targetId) {
          const el = this.createdElements.get(action.targetId);
          if (el) targets.push(el);
        } else if (action.targetSelector) {
          targets = Array.from(document.querySelectorAll(action.targetSelector));
        }

        if (targets.length > 0) {
          targets.forEach(target => {
            // Backup original styles before overwriting
            if (window.morphEngine) {
              window.morphEngine.getOriginalStyle(target);
              this.modifiedElements.add(target);
            } else if (!this.originalStyles.has(target)) {
              this.originalStyles.set(target, target.getAttribute('style') || '');
            }

            if (action.styles) {
              for (let [key, value] of Object.entries(action.styles)) {
                let priority = '';
                if (typeof value === 'string' && value.includes('!important')) {
                  priority = 'important';
                  value = value.replace('!important', '').trim();
                }
                // Convert camelCase to kebab-case (e.g., backgroundImage -> background-image)
                const kebabKey = key.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`);
                target.style.setProperty(kebabKey, value, priority);
              }
            }
          });
        }
        break;
      }

      case 'removeElement': {
        const target = document.querySelector(action.targetSelector);
        if (target) {
          if (window.morphEngine) {
            window.morphEngine.getOriginalStyle(target);
            this.modifiedElements.add(target);
          } else if (!this.originalStyles.has(target)) {
            this.originalStyles.set(target, target.getAttribute('style') || '');
          }
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

    if (this.styleElement && this.styleElement.parentNode) {
      this.styleElement.parentNode.removeChild(this.styleElement);
      this.styleElement = null;
    }

    // 1. Remove all dynamically created elements
    for (const [id, el] of this.createdElements.entries()) {
      if (el && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    }
    this.createdElements.clear();

    // 2. Restore original styles
    if (window.morphEngine) {
      for (const target of this.modifiedElements) {
        if (target && window.morphEngine.globalOriginalStyles.has(target)) {
          target.setAttribute('style', window.morphEngine.globalOriginalStyles.get(target));
        }
      }
      this.modifiedElements.clear();
    } else {
      for (const [target, originalStyle] of this.originalStyles.entries()) {
        if (target) {
          target.setAttribute('style', originalStyle);
        }
      }
      this.originalStyles.clear();
    }

    console.log(`[DynamicMorph] Revert complete.`);
    return true;
  }
};
