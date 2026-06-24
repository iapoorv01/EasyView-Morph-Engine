// content/engine/morph-engine.js
/**
 * Transformation Engine Architecture
 * 
 * Orchestrates the application and reversal of website morphs.
 * Maintains state of what modifications have been applied.
 */

window.MorphEngine = class MorphEngine {
  constructor() {
    this.activeMorphs = new Map();
    this.availableMorphs = new Map();
  }

  registerMorph(morphId, morphClass) {
    this.availableMorphs.set(morphId, morphClass);
    console.log(`[Morph Engine] Registered morph: ${morphId}`);
  }

  async executeMorph(morphId, parameters = {}) {
    if (!this.availableMorphs.has(morphId)) {
      console.warn(`[Morph Engine] Morph ID ${morphId} not found or unsupported on this site.`);
      return false;
    }

    if (this.activeMorphs.has(morphId)) {
      console.log(`[Morph Engine] Morph ${morphId} is already active.`);
      return true;
    }

    const MorphClass = this.availableMorphs.get(morphId);
    const morphInstance = new MorphClass(parameters);
    
    try {
      const success = await morphInstance.apply();
      if (success) {
        this.activeMorphs.set(morphId, morphInstance);
        return true;
      }
    } catch (err) {
      console.error(`[Morph Engine] Error executing morph ${morphId}:`, err);
    }
    return false;
  }

  async undoMorph(morphId) {
    if (this.activeMorphs.has(morphId)) {
      const morphInstance = this.activeMorphs.get(morphId);
      await morphInstance.revert();
      this.activeMorphs.delete(morphId);
      return true;
    }
    return false;
  }
};
