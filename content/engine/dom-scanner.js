// content/engine/dom-scanner.js
/**
 * DOM Scanner for V2 AI Integration
 * Extracts a lightweight, semantic map of the DOM to send to the LLM.
 */

window.MorphDOMScanner = class MorphDOMScanner {
  constructor() {
    // Elements to completely ignore to save LLM tokens
    this.ignoreTags = new Set(['SCRIPT', 'STYLE', 'SVG', 'PATH', 'NOSCRIPT', 'IFRAME']);
  }

  /**
   * Scans a root element and returns a simplified JSON representation.
   * @param {HTMLElement} root - The element to start scanning from (defaults to document.body)
   * @param {number} maxDepth - Prevent infinite loops / overly deep structures
   * @returns {Object} Simplified DOM map
   */
  scan(root = document.body, maxDepth = 5) {
    return this._traverse(root, 0, maxDepth);
  }

  _traverse(node, currentDepth, maxDepth) {
    if (!node || currentDepth > maxDepth) return null;
    if (this.ignoreTags.has(node.tagName)) return null;

    // Only process Element nodes and Text nodes with actual content
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent.trim();
      return text ? { type: 'text', content: text.substring(0, 100) } : null;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return null;

    const elementMap = {
      tag: node.tagName.toLowerCase(),
    };

    // Grab important identifiers
    if (node.id) elementMap.id = node.id;
    if (node.className && typeof node.className === 'string') {
      // Keep only first 3 classes to save space
      elementMap.classes = node.className.split(' ').slice(0, 3).join(' ');
    }

    // Grab semantic/accessibility info
    const role = node.getAttribute('role');
    if (role) elementMap.role = role;
    
    const ariaLabel = node.getAttribute('aria-label');
    if (ariaLabel) elementMap.ariaLabel = ariaLabel;

    // Traverse children
    const children = [];
    for (const child of node.childNodes) {
      const childMap = this._traverse(child, currentDepth + 1, maxDepth);
      if (childMap) {
        // If child is just text, and parent has no other meaningful children, simplify structure
        if (childMap.type === 'text' && node.childNodes.length === 1) {
          elementMap.text = childMap.content;
        } else {
          children.push(childMap);
        }
      }
    }

    if (children.length > 0) {
      elementMap.children = children;
    }

    return elementMap;
  }

  /**
   * Generates a stringified payload ready for the LLM
   */
  getSerializedMap(root = document.body) {
    const map = this.scan(root);
    return JSON.stringify(map);
  }
};
