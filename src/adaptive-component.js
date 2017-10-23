/*
 * Copyright (C) 2017 Fraunhofer IAO
 * All rights reserved.
 *
 * This software may be modified and distributed under the terms
 * of the Clear BSD license.  See the LICENSE file for details.
 */

import {PROFILE_CHANGED_EVENT, PROFILE_REQUEST_EVENT} from 'profilestore.js';
import AdaptiveVariant from 'adaptive-variant.js';

/*
 * @param {Class} superclass The super class the mixin will be applied to.
 */
export default (superclass) => {
  /**
   * The {@link AdaptiveVariant}s of this component type.
   * @memberof AdaptiveComponent
   * @type {Class[]} subclasses of {@link AdaptiveVariant}
   * @static
   * @private
   */
  let _variantTypes = new Array();

  /**
   * The default {@link AdaptiveVariant} of this component type.
   * @memberof AdaptiveComponent
   * @type {Class} subclass of {@link AdaptiveVariant}
   * @static
   * @private
   */
  let _defaultVariantType = null;

  /**
   * Mixin to create Adaptive Web Component classes.
   */
  class AdaptiveComponent extends superclass {
    constructor() {
      super();

      /**
       * The instance of the current variant.
       * @member {AdaptiveVariant}
       * @private
       */
      this._currentVariant = null;

      /**
       * The instance of the variant that is prepared to become the current one.
       * @member {AdaptiveVariant}
       * @private
       */
      this._preparedVariant = null;

      /**
       * The node this component listens on for {@link PROFILE_CHANGED_EVENT}s
       * @member {Node}
       * @private
       */
      this._profileEventNode = null;

      /**
       * Handler for {@link PROFILE_CHANGED_EVENT}s that is bound to this component.
       * @member {Function}
       * @private
       */
      this._profileChangeHandler = this._profileChanged.bind(this);

      /**
       * Indicates if the component manages its decendants in its shadow DOM.
       * @member {Boolean}
       * @private
       */
      this._managing = false;

      /**
       * The collection of decentant components managed by this component.
       * @member {AdaptiveComponent[]}
       * @private
       */
      this._managedComponents = new Array();

      /**
       * The most recent profile this component received in managing mode, <code>null</code> if
       * this component is not managing.
       * @member {Object}
       * @private
       */
      this._currentProfile = null;

      /**
       * Handler for {@link PROFILE_REQUEST_EVENT}s that is bound to this component.
       * @member {Function}
       * @private
       */
      this._profileRequestHandler = this._profileRequest.bind(this);

      /**
       * Indicates if the component is managed by another component.
       * @member {Boolean}
       * @private
       */
      this._managedBy = null;
      
      // Create shadow dom
      this.attachShadow({mode: 'open'});
    }
    
    /**
     * The current {@link AdaptiveVariant} instance for this component.
     * @readonly
     * @returns {AdaptiveVariant} the current variant's instance.
     */
    get variant() {
      return this._currentVariant;
    }

    /**
     * Indicates if this component is managing its decentants or behaves transparent in terms 
     * of {@link PROFILE_REQUEST_EVENT}s from the decentants in its shadow DOM.
     * @returns {Boolean} <code>true</code> if the component is managing, <code>false</code> if not. 
     */
    get managing() {
      return this._managing;
    }

    /**
     * Sets this component to managing mode or transparent mode (default). In managing mode, it manages the 
     * adaptation behavior of the decentants in its shadow DOM. In transparent mode, it does not influence
     * the bubbling of {@link PROFILE_REQUEST_EVENT}s comming from its shadow DOM.
     * @param {Boolean} flag <code>true</code> to set the component to managing mode, 
     *        <code>false</code> to set it to transparent mode.
     */
    set managing(flag) {
      console.warn('Managing Mode is currently not available in Adaptive Web Components!');
      return;
      
      if (this._managing == flag) {
        return;
      }

      this._managing = flag;

      // Sync with attribute if required
      const attributeName = AWC_ATTRIBUTE_PREFIX + 'managing';
      if (this._managing && !this.hasAttribute(attributeName)) {
        this.setAttribute(attributeName, '');
      } else if (!this._managing && this.hasAttribute(attributeName)) {
        this.removeAttribute(attributeName, '');
      }

      if (this._managing) {
        // Set up managing functions
        this.shadowRoot.addEventListener(PROFILE_REQUEST_EVENT, this._profileRequestHandler);
                
      } else {
        // Remove managing functions
        this.shadowRoot.removeEventListener(PROFILE_REQUEST_EVENT, this._profileRequestHandler);
        
        this._currentProfile = null;
      }
    }

    /**
     * Indicates if this components adaptation is managed by another component. If in managed mode, 
     * this component does not itself listen to {@link PROFILE_CHANGED_EVENT}s. Instead, the managing
     * component will call {@link AdaptiveComponent#prepareAdaptation} and 
     * {@link AdaptiveComponent#performAdaptation} directly.
     * @readonly
     * @returns {Boolean} <code>true</code> if the component is managed, <code>false</code> if not. 
     */
    get managed() {
      return (this._managedBy != null);
    }

    /**
     * Called when the instance of the component has been connected to, i.e. 
     * inserted into a document.
     */
    connectedCallback() {
      // Initialize default variant
      if (this._currentVariant == null && this._preparedVariant == null) {
        this.prepareAdaptation({});
      }
      if (this._currentVariant == null && this._preparedVariant != null) {
        this.performAdaptation({});
      }

      // Request initial profile
      if (this._profileEventNode == null) {
        this.dispatchEvent(new CustomEvent(PROFILE_REQUEST_EVENT, { 
          bubbles: true, // bubbles along the DOM tree towards its root (i.e. window)
          composed: true, // bubbles across shadow DOM boundaries
          cancelable: true, // can be canceled by listeners
          detail: { 
            callback: (profile, source) => {
              // Adapt to profile, but only once
              if (this._profileEventNode == null) {
                this.prepareAdaptation(profile);
                this.performAdaptation(profile);

                this._profileEventNode = source;
                // Register to profile change events
                this._profileEventNode.addEventListener(PROFILE_CHANGED_EVENT, this._profileChangeHandler);
              }
            },
            managedCallback: (manager) => {
              this._managedBy = manager;
            }
          }
        }));
      }
    }
    
    /**
     * Called when the instance of the component has been disconnected from, i.e. 
     * removed from a document.
     */
    disconnectedCallback() {
      if (this._profileEventNode != null) {
        // Unregister from profile change events in self-adaptive mode
        this._profileEventNode.removeEventListener(PROFILE_CHANGED_EVENT, this._profileChangeHandler);
        this._profileEventNode = null;
      } 
      if (this._managedBy != null) {
        // Notify manager in managed mode
        this._managedBy.removeManagedComponent(this);
        this._managedBy = null;
      }
    }

    /**
     * Defines the attributes that are observed, i.e. for which attributes the 
     * {@link #attributeChangedCallback} will be called.
     * 
     * @readonly
     * @static
     */
    static get observedAttributes() {
      return [AWC_ATTRIBUTE_PREFIX + 'managing'];
    }

    /**
     * Called when an attribute was added, removed or modified at the instance 
     * of the component.
     * 
     * @param {String} attrName The name of the changed attribute.
     * @param {Any} oldVal The old value of the attribute.
     * @param {Any} newVal The new value of the attribute.
     */
    attributeChangedCallback(attrName, oldVal, newVal) {
      if (attrName == AWC_ATTRIBUTE_PREFIX + 'managing') {
        this.managing = this.hasAttribute(AWC_ATTRIBUTE_PREFIX + 'managing');
      }
    }
    
    /**
     * Called when the instance of the component has been adopted by another document.
     * 
     * @param {Document} oldDocument The document the element has been taken from.
     * @param {Document} newDocument The document the element has been adpoted by.
     */
    adoptedCallback(oldDocument, newDocument) {

    }

    /**
     * Prepares the adaptation of the component according to the given profile.
     * 
     * @param {Object} profile The profile to adapt to.
     */
    prepareAdaptation(profile) {
      // Determine matching variant type
      let newVariantType = this._selectFirstMatchingVariantType(profile);

      if (newVariantType == null) {
        // Uh-oh, not even a default variant?!
        console.warn(`${this.localName} has not been able to select a variant!`);
        return;
      }

      if (this._currentVariant != null && newVariantType == Object.getPrototypeOf(this._currentVariant).constructor) {
        // No adaptation required in this component, because the selected variant is already the current one
        this._prepareManagedComponents(profile);
        return;
      }

      // Create instance of selected variant
      this._preparedVariant = new newVariantType();

      // Notify current variant
      let variantState = {};
      if (this._currentVariant != null) {
        variantState = this._currentVariant.deselectedCallback(); 
      }

      // Notify prepared variant
      this._preparedVariant.selectedCallback(variantState);

      // Prepare managed components
      this._prepareManagedComponents(profile);
    }

    /**
     * Performes the adaptation of the component according to the given profile.
     * 
     * @param {Object} profile The profile to adapt to.
     */
    performAdaptation(profile) {
      // No adaptation if no variant prepared or prepared variant is already the current one
      if (this._preparedVariant == null || this._preparedVariant == this._currentVariant) {
        this._adaptManagedComponents(profile);
        return;
      }

      // Disconnect current variant
      if (this._currentVariant != null) {
        this._currentVariant.disconnectedCallback();
        this._currentVariant.contentRoot = null;
      }

      // Remove current variant's contents
      while (this.shadowRoot.firstChild) {
        this.shadowRoot.removeChild(this.shadowRoot.firstChild);
      }
      
      // Connect prepared variant
      this._preparedVariant.contentRoot = this.shadowRoot;
      this._preparedVariant.connectedCallback();
      
      // Prepared variant now is the current variant
      this._currentVariant = this._preparedVariant;
      this._preparedVariant = null;

      // Adapt managed components
      this._adaptManagedComponents(profile);
    }

    /**
     * Event handling routine for {@link PROFILE_CHANGED_EVENT}s.
     * 
     * @param {CustomEvent} event The custom event carrying the detailed profile changes and new profile.
     * 
     * @private
     */
    _profileChanged(event) {
      let profile = event.detail.current
      this.prepareAdaptation(profile);
      this.performAdaptation(profile);
    }

    /**
     * Selects the first variant matching the given profile.
     * 
     * @param {Object} profile 
     * @returns {Class} Subclass of {@link AdaptiveVariant}
     * 
     * @private
     */
    _selectFirstMatchingVariantType(profile) {
      let firstMatch = null;
        _variantTypes.every(function(variantType) {
          if (variantType.matches(profile)) {
            firstMatch = variantType;
            return false;
          }
          return true;
        });
      
        return firstMatch != null ? firstMatch : _defaultVariantType;
    }

    /**
     * Event handling routine for {@link PROFILE_REQUEST_EVENT}s.
     * 
     * @param {CustomEvent} event The custom event representing the request for a profile.
     * 
     * @private
     */
    _profileRequest(event) {

      // Add requesting component to managed components
      let component = event.target;
      this._managedComponents.push(component);
      event.detail.managedCallback(this);

      // Adapt requesting component to current profile
      if (this._currentProfile != null) {
        component.prepareAdaptation(this._currentProfile);
        component.performAdaptation(this._currentProfile);
      }

      // Stop further handling of this request
      event.stopImmediatePropagation();
    }

    /**
     * Removes a component from the list of managed components. Typically because it has been removed
     * from the shadow DOM of this component and should therefore no further be managed.
     * 
     * @param {AdaptiveComponent} component The component to be removed.
     */
    removeManagedComponent(component) {
      // If removed component is managed by this component
      let index = this._managedComponents.indexOf(component);
      if (index > -1) {
        // Remove component from managed components
        this._managedComponents.splice(index, 1);
      }
    }

    /**
     * Prepares the adaptation of all managed components.
     * 
     * @param {Object} profile The profile to adapt to.
     * 
     * @private
     */
    _prepareManagedComponents(profile) {
      if (!this._managing) {
        return;
      }

      this._managedComponents.forEach((component) => {
        component.prepareAdaptation(profile);
      });
    }

    /**
     * Performs the adaptation of all managed components.
     * 
     * @param {Object} profile The profile to adapt to.
     * 
     * @private
     */
    _adaptManagedComponents(profile) {
      if (!this._managing) {
        return;
      }

      this._currentProfile = profile;

      this._managedComponents.forEach((component) => {
        component.performAdaptation(profile);
      });
    }

    /**
     * Registers a variant for this component.
     * 
     * @param {Class} variant The subclass of {@link AdaptiveVariant} to register.
     * @static
     */
    static registerVariant(variant) {
      // Add to variants of this component
      _variantTypes.push(variant);

      // Set the first registered variant as the default variant
      if (_variantTypes.length == 1) {
        AdaptiveComponent.defaultVariant = variant;
      }
    }

    /**
     * Sets an already registered variant as the default variant for this component.
     * 
     * @param {Class} variant The registered subclass of {@link AdaptiveVariant} that should be used as default variant.
     * 
     * @throws {Error} If 'variant' is not a registered variant of this component.
     * 
     * @static
     */
    static set defaultVariant(variant) {
      if (_variantTypes.indexOf(variant) < 0) {
        throw new Error('Provided variant is not registered for this component.');
      }

      _defaultVariantType = variant;
    }

    /**
     * @returns {Class} The subclass of {@link AdaptiveVariant} set as default variant.
     * @static
     */
    static get defaultVariant() {
      return _defaultVariantType;
    }
  };

  return AdaptiveComponent;
};

/**
 * Prefix for all attributes related to the adaptive web components framework.
 */
const AWC_ATTRIBUTE_PREFIX = 'awc-';