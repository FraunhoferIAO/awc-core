/*
 * Copyright (C) 2017 Fraunhofer IAO
 * All rights reserved.
 *
 * This software may be modified and distributed under the terms
 * of the Clear BSD license.  See the LICENSE file for details.
 */

/**
 * A variant of an Adaptive Web Component.
 */
export default class AdaptiveVariant {
  constructor() {
    /**
     * The {@link Node} that contains the variant's DOM contents, e.g. the shadow root.
     * @member {Node}
     * @private
     */
    this._contentRoot = null;
  }

  /**
   * @returns {DocumentFragment}
   * @readonly
   */
  get template() {
    return new DocumentFragment();
  }

  /**
   * @returns {Node} The node that contains the variant's DOM contents, e.g. the shadow root.
   */
  get contentRoot() {
    return this._contentRoot;
  }

  /**
   * Sets the node that contains the variant's DOM contents.
   * 
   * @param {Node} node The node that contains the variant's DOM contents, e.g. the shadow root.
   */
  set contentRoot(node) {
    this._contentRoot = node;
  }

  /**
   * Called when the variant has been selected as the current variant for the owning component.
   * 
   * @param {Object} state The internal state the variant should take up
   */
  selectedCallback(state) {
    let prototype = Object.getPrototypeOf(this);
    for (let property in state) {
      if (!AdaptiveVariant.prototype.hasOwnProperty(property)
        && typeof Object.getOwnPropertyDescriptor(prototype, property).set == 'function') {
        this[property] = state[property];
      }
    }
  }

  /**
   * Called when the variant has been deselected as the current variant for the owning component.
   * 
   * @returns {Object} The internal state of the variant
   */
  deselectedCallback() {
    let state = {};
    let prototype = Object.getPrototypeOf(this);
    for (let property in Object.getOwnPropertyDescriptors(prototype)) {
      if (!AdaptiveVariant.prototype.hasOwnProperty(property)
        && typeof Object.getOwnPropertyDescriptor(prototype, property).get == 'function') {
        state[property] = this[property];
      }
    }

    return state;
  }

  /**
   * Called after the variant has been connected to the component's content root.
   */
  connectedCallback() {
    if (window.ShadyCSS && (!ShadyCSS.nativeShadow || !ShadyCSS.nativeCss)) {
      // Wrap variant content into generated variant custom element to ensure proper CSS scoping
      // {@link https://github.com/webcomponents/shadycss/issues/115}
      let wrapper = wrapScope.apply(this);
      this.contentRoot.appendChild(wrapper);
      let host = this.contentRoot.host;
      host.childNodes.forEach(function(child) {
        wrapper.appendChild(child.cloneNode(true));
      });
      this.contentRoot = wrapper.shadowRoot;
      window.ShadyCSS.styleSubtree(host);
      
    } else {
      // Native shadow dom, no scope wrapper required
      let clone = document.importNode(this.template, true);
      this.contentRoot.appendChild(clone);
    }
  }

  /**
   * Called after the variant's contents have been removed from the component's content root.
   */
  disconnectedCallback() {
    
  }

  /**
   * Checks if the variant matches the given context.
   * @param {Object} profile 
   */
  static matches(profile) {
    return false;
  }
}

/**
 * Creates a variant specific wrapper element for proper shady CSS scoping since the ShadyCSS shim
 * uses the name of the custom element as scope name.
 * 
 * @returns {HMTLElement} a new instance of the variant specific wrapper element
 * 
 * @private
 */
function wrapScope() {
  // Get type of variant instance
  let variantType = Object.getPrototypeOf(this);

  // If variant type does not yet have a wrapper element registered
  if (!variantType._wrapperName) {
    // Append variant name to the component's element name
    variantType._wrapperName = this.contentRoot.host.localName + '--' + this.constructor.name.toLowerCase();
    
    // Create and prepare a template element with the contents of the variants template
    let tmpl = document.createElement('template');
    this.template.childNodes.forEach(function(child) {
      tmpl.content.appendChild(child);
    });
    window.ShadyCSS.prepareTemplate(tmpl, this._wrapperName);

    // Define wrapper custom element
    window.customElements.define(this._wrapperName, class extends HTMLElement {
      constructor() {
        super();
        this.attachShadow({mode: 'open'});
      }
      connectedCallback() {
        let clone = document.importNode(tmpl.content, true);
        this.shadowRoot.appendChild(clone);
      }
    });
  }

  // Return a new wrapper element
  return document.createElement(this._wrapperName);
}