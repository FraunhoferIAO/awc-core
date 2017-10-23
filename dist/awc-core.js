/*
 * Copyright (C) 2017 Fraunhofer IAO
 * All rights reserved.
 *
 * This software may be modified and distributed under the terms
 * of the Clear BSD license. See the LICENSE file for details.
 */
!function(e){function r(e,r,o){return 4===arguments.length?t.apply(this,arguments):void n(e,{declarative:!0,deps:r,declare:o})}function t(e,r,t,o){n(e,{declarative:!1,deps:r,executingRequire:t,execute:o})}function n(e,r){r.name=e,e in v||(v[e]=r),r.normalizedDeps=r.deps}function o(e,r){if(r[e.groupIndex]=r[e.groupIndex]||[],-1==g.call(r[e.groupIndex],e)){r[e.groupIndex].push(e);for(var t=0,n=e.normalizedDeps.length;n>t;t++){var a=e.normalizedDeps[t],u=v[a];if(u&&!u.evaluated){var d=e.groupIndex+(u.declarative!=e.declarative);if(void 0===u.groupIndex||u.groupIndex<d){if(void 0!==u.groupIndex&&(r[u.groupIndex].splice(g.call(r[u.groupIndex],u),1),0==r[u.groupIndex].length))throw new TypeError("Mixed dependency cycle detected");u.groupIndex=d}o(u,r)}}}}function a(e){var r=v[e];r.groupIndex=0;var t=[];o(r,t);for(var n=!!r.declarative==t.length%2,a=t.length-1;a>=0;a--){for(var u=t[a],i=0;i<u.length;i++){var s=u[i];n?d(s):l(s)}n=!n}}function u(e){return y[e]||(y[e]={name:e,dependencies:[],exports:{},importers:[]})}function d(r){if(!r.module){var t=r.module=u(r.name),n=r.module.exports,o=r.declare.call(e,function(e,r){if(t.locked=!0,"object"==typeof e)for(var o in e)n[o]=e[o];else n[e]=r;for(var a=0,u=t.importers.length;u>a;a++){var d=t.importers[a];if(!d.locked)for(var i=0;i<d.dependencies.length;++i)d.dependencies[i]===t&&d.setters[i](n)}return t.locked=!1,r},{id:r.name});t.setters=o.setters,t.execute=o.execute;for(var a=0,i=r.normalizedDeps.length;i>a;a++){var l,s=r.normalizedDeps[a],c=v[s],f=y[s];f?l=f.exports:c&&!c.declarative?l=c.esModule:c?(d(c),f=c.module,l=f.exports):l=p(s),f&&f.importers?(f.importers.push(t),t.dependencies.push(f)):t.dependencies.push(null),t.setters[a]&&t.setters[a](l)}}}function i(e){var r,t=v[e];if(t)t.declarative?f(e,[]):t.evaluated||l(t),r=t.module.exports;else if(r=p(e),!r)throw new Error("Unable to load dependency "+e+".");return(!t||t.declarative)&&r&&r.__useDefault?r["default"]:r}function l(r){if(!r.module){var t={},n=r.module={exports:t,id:r.name};if(!r.executingRequire)for(var o=0,a=r.normalizedDeps.length;a>o;o++){var u=r.normalizedDeps[o],d=v[u];d&&l(d)}r.evaluated=!0;var c=r.execute.call(e,function(e){for(var t=0,n=r.deps.length;n>t;t++)if(r.deps[t]==e)return i(r.normalizedDeps[t]);throw new TypeError("Module "+e+" not declared as a dependency.")},t,n);void 0!==c&&(n.exports=c),t=n.exports,t&&t.__esModule?r.esModule=t:r.esModule=s(t)}}function s(r){var t={};if(("object"==typeof r||"function"==typeof r)&&r!==e)if(m)for(var n in r)"default"!==n&&c(t,r,n);else{var o=r&&r.hasOwnProperty;for(var n in r)"default"===n||o&&!r.hasOwnProperty(n)||(t[n]=r[n])}return t["default"]=r,x(t,"__useDefault",{value:!0}),t}function c(e,r,t){try{var n;(n=Object.getOwnPropertyDescriptor(r,t))&&x(e,t,n)}catch(o){return e[t]=r[t],!1}}function f(r,t){var n=v[r];if(n&&!n.evaluated&&n.declarative){t.push(r);for(var o=0,a=n.normalizedDeps.length;a>o;o++){var u=n.normalizedDeps[o];-1==g.call(t,u)&&(v[u]?f(u,t):p(u))}n.evaluated||(n.evaluated=!0,n.module.execute.call(e))}}function p(e){if(I[e])return I[e];if("@node/"==e.substr(0,6))return I[e]=s(D(e.substr(6)));var r=v[e];if(!r)throw"Module "+e+" not present.";return a(e),f(e,[]),v[e]=void 0,r.declarative&&x(r.module.exports,"__esModule",{value:!0}),I[e]=r.declarative?r.module.exports:r.esModule}var v={},g=Array.prototype.indexOf||function(e){for(var r=0,t=this.length;t>r;r++)if(this[r]===e)return r;return-1},m=!0;try{Object.getOwnPropertyDescriptor({a:0},"a")}catch(h){m=!1}var x;!function(){try{Object.defineProperty({},"a",{})&&(x=Object.defineProperty)}catch(e){x=function(e,r,t){try{e[r]=t.value||t.get.call(e)}catch(n){}}}}();var y={},D="undefined"!=typeof System&&System._nodeRequire||"undefined"!=typeof require&&"undefined"!=typeof require.resolve&&"undefined"!=typeof process&&process.platform&&require,I={"@empty":{}};return function(e,n,o,a){return function(u){u(function(u){for(var d={_nodeRequire:D,register:r,registerDynamic:t,get:p,set:function(e,r){I[e]=r},newModule:function(e){return e}},i=0;i<n.length;i++)(function(e,r){r&&r.__esModule?I[e]=r:I[e]=s(r)})(n[i],arguments[i]);a(d);var l=p(e[0]);if(e.length>1)for(var i=1;i<e.length;i++)p(e[i]);return o?l["default"]:l})}}}("undefined"!=typeof self?self:global)

(["1"], [], false, function($__System) {
var require = this.require, exports = this.exports, module = this.module;
!function(e){function r(e,r){for(var n=e.split(".");n.length;)r=r[n.shift()];return r}function n(n){if("string"==typeof n)return r(n,e);if(!(n instanceof Array))throw new Error("Global exports must be a string or array.");for(var t={},o=!0,f=0;f<n.length;f++){var i=r(n[f],e);o&&(t["default"]=i,o=!1),t[n[f].split(".").pop()]=i}return t}function t(r){if(Object.keys)Object.keys(e).forEach(r);else for(var n in e)a.call(e,n)&&r(n)}function o(r){t(function(n){if(-1==l.call(s,n)){try{var t=e[n]}catch(o){s.push(n)}r(n,t)}})}var f,i=$__System,a=Object.prototype.hasOwnProperty,l=Array.prototype.indexOf||function(e){for(var r=0,n=this.length;n>r;r++)if(this[r]===e)return r;return-1},s=["_g","sessionStorage","localStorage","clipboardData","frames","frameElement","external","mozAnimationStartTime","webkitStorageInfo","webkitIndexedDB","mozInnerScreenY","mozInnerScreenX"];i.set("@@global-helpers",i.newModule({prepareGlobal:function(r,t,i){var a=e.define;e.define=void 0;var l;if(i){l={};for(var s in i)l[s]=e[s],e[s]=i[s]}return t||(f={},o(function(e,r){f[e]=r})),function(){var r;if(t)r=n(t);else{r={};var i,s;o(function(e,n){f[e]!==n&&"undefined"!=typeof n&&(r[e]=n,"undefined"!=typeof i?s||i===n||(s=!0):i=n)}),r=s?r:i}if(l)for(var u in l)e[u]=l[u];return e.define=a,r}}}))}("undefined"!=typeof self?self:global);
$__System.register('2', ['3', '4'], function (_export, _context) {
  "use strict";

  var PROFILE_CHANGED_EVENT, PROFILE_REQUEST_EVENT, AdaptiveVariant;
  return {
    setters: [function (_) {
      PROFILE_CHANGED_EVENT = _.PROFILE_CHANGED_EVENT;
      PROFILE_REQUEST_EVENT = _.PROFILE_REQUEST_EVENT;
    }, function (_2) {
      AdaptiveVariant = _2.default;
    }],
    execute: function () {
      _export('default', superclass => {
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
            this.attachShadow({ mode: 'open' });
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
            return this._managedBy != null;
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
                  managedCallback: manager => {
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
          adoptedCallback(oldDocument, newDocument) {}

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
            let profile = event.detail.current;
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
            _variantTypes.every(function (variantType) {
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

            this._managedComponents.forEach(component => {
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

            this._managedComponents.forEach(component => {
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
      });

      /**
       * Prefix for all attributes related to the adaptive web components framework.
       */
      const AWC_ATTRIBUTE_PREFIX = 'awc-';
    }
  };
});
$__System.register('4', [], function (_export, _context) {
  "use strict";

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
      this.template.childNodes.forEach(function (child) {
        tmpl.content.appendChild(child);
      });
      window.ShadyCSS.prepareTemplate(tmpl, this._wrapperName);

      // Define wrapper custom element
      window.customElements.define(this._wrapperName, class extends HTMLElement {
        constructor() {
          super();
          this.attachShadow({ mode: 'open' });
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
  return {
    setters: [],
    execute: function () {
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
      class AdaptiveVariant {
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
            if (!AdaptiveVariant.prototype.hasOwnProperty(property) && typeof Object.getOwnPropertyDescriptor(prototype, property).set == 'function') {
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
            if (!AdaptiveVariant.prototype.hasOwnProperty(property) && typeof Object.getOwnPropertyDescriptor(prototype, property).get == 'function') {
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
            host.childNodes.forEach(function (child) {
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
        disconnectedCallback() {}

        /**
         * Checks if the variant matches the given context.
         * @param {Object} profile 
         */
        static matches(profile) {
          return false;
        }
      }
      _export('default', AdaptiveVariant);
    }
  };
});
$__System.register('5', ['3'], function (_export, _context) {
  "use strict";

  var ProfileStore;
  return {
    setters: [function (_) {
      ProfileStore = _.default;
    }],
    execute: function () {

      /**
       * A {@link ProfileStore} implementation based on {@link https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage HTML5 Local Storage}.
       * 
       * @param {EventTarget} [attachTo=window] - Specifies the node this ProfileStore is attached to and dispatches its events to.
       */
      class LocalProfileStore extends ProfileStore {
        constructor(attachTo = window) {
          super(true, attachTo);

          if (typeof window.localStorage !== 'undefined') {
            if (!window.localStorage.getItem(LOCAL_STORAGE_KEY)) {
              // Local storage is available, but not initialized, so initialize
              window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({}));
            }
            // Fill current profile variable
            this._profile = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEY));
          }
        }

        /**
         * Allows to request a value change of profile properties. It returns a promise to
         *
         * @param {Object} newValues - A map of the requested property changes. JSON structured like
         * 		<code>{ propertyName: newValue , ... }</code>.
         */
        changeProfile(newValues) {
          let changedValues = {};

          for (let property in newValues) {
            // Get old value
            let oldValue = undefined;
            if (property in this._profile) {
              oldValue = this._profile[property];
            }

            // Change necessary?
            let newValue = newValues[property];
            if (oldValue != newValue) {
              if (newValue !== undefined) {
                this._profile[property] = newValue;
              } else {
                Reflect.deleteProperty(this._profile, property);
              }

              changedValues[property] = { from: oldValue, to: newValue };
            }
          }

          // Only if there have been changes
          if (Object.getOwnPropertyNames(changedValues).length > 0) {
            // Update local storage
            window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this._profile));

            // Dispatch change event
            this._profileChanged(changedValues);
          }

          return Promise.resolve(changedValues);
        }
      }

      _export('default', LocalProfileStore);

      /**
       * The storage key used for storing the profile.
       * @type {String}
       */
      const LOCAL_STORAGE_KEY = 'awcLocalProfileStore';

      _export('LOCAL_STORAGE_KEY', LOCAL_STORAGE_KEY);
    }
  };
});
$__System.register('3', [], function (_export, _context) {
  "use strict";

  return {
    setters: [],
    execute: function () {
      /*
       * Copyright (C) 2017 Fraunhofer IAO
       * All rights reserved.
       *
       * This software may be modified and distributed under the terms
       * of the Clear BSD license.  See the LICENSE file for details.
       */

      /**
       * Simple volatile in-memory profile store. 
       * Mainly serves as a base class for implementations that represent different sources, storage locations 
       * or fetch methods for user interface profiles.
       * 
       * @param {Boolean} [changeable=false] - Specifies if the store supports to change the stored profile.
       * @param {EventTarget} [attachTo=window] - Specifies the node this ProfileStore is attached to and dispatches its events to.
       */
      class ProfileStore {
        constructor(changeable = false, attachTo = window) {
          /** 
           * The current profile
           * @member {Object}
           * @protected
           */
          this._profile = {};

          /** 
           * Flag indicating if changes of the profile are supported
           * @member {Boolean}
           * @private
           */
          this._changeable = changeable;

          /**
           * Node that is used for dispatching profile changed events and listening to profile requests.
           * @member {EventTarget}
           * @private
           */
          this._attachedTo = attachTo;

          /**
           * Handler for {@link PROFILE_REQUEST_EVENT}s that is bound to this store.
           * @member {Function}
           * @private
           */
          this._profileRequestHandler = this._profileRequest.bind(this);

          // Listen for profile requests
          this._attachedTo.addEventListener(PROFILE_REQUEST_EVENT, this._profileRequestHandler);
        }

        /**
         * The current user interface profile.
         * @readonly
         * @returns {Promise} A promise to the current user interface profile.
         */
        get profile() {
          return new Promise((resolve, reject) => {
            if (this._profile) {
              resolve(Object.assign({}, this._profile));
            } else {
              reject('No profile available.');
            }
          });
        }

        /**
         * Indicates if changes of the profile are supported.
         * @readonly
         * @returns {Boolean} <code>true</code> if profile store supports to change the profile, <code>false</code> if not. 
         */
        get changeable() {
          return this._changeable;
        }

        /**
         * Allows to request a value change of profile properties. It returns the effective changes.
         * 
         * @param {Object<String, ?Any>} newValues - A map of the requested property changes. JSON structured like
         * 		<code>{ propertyName: newValue , ... }</code>.
         * 
         * @returns {Promise} A promise to the effective changes.
         */
        changeProfile(newValues) {
          if (!this._changeable) {
            return Promise.reject('Changing the profile is not supported.');
          }

          let changedValues = {};

          for (let property in newValues) {
            // Get old value
            let oldValue = undefined;
            if (property in this._profile) {
              oldValue = this._profile[property];
            }

            // Change necessary?
            let newValue = newValues[property];
            if (oldValue != newValue) {
              if (newValue !== undefined) {
                this._profile[property] = newValue;
              } else {
                Reflect.deleteProperty(this._profile, property);
              }

              changedValues[property] = { from: oldValue, to: newValue };
            }
          }

          // Only if there have been changes
          if (Object.getOwnPropertyNames(changedValues).length > 0) {
            // Dispatch change event
            this._profileChanged(changedValues);
          }

          return Promise.resolve(changedValues);
        }

        /**
         * Creates and dispatches a profile changed event containing information on changed values of profile properties.
         * 
         * @param {ProfileDiff} diff - A data structure describing the last changes to the profile properties. Expected to
         *      be structured like <code>{ propertyName: { from: oldValue, to: newValue }, ... }</code>.
         */
        _profileChanged(diff) {
          // Create profile changed event
          let changeEvent = new CustomEvent(PROFILE_CHANGED_EVENT, { detail: {
              store: this,
              current: Object.assign({}, this._profile),
              changes: diff
            } });

          // Dispatch event
          this._attachedTo.dispatchEvent(changeEvent);
        }

        /**
         * Handles profile requests by providing the current profile to the provided callback and stopping the further 
         * event propagation immediatly.
         * 
         * @param {CustomEvent} event The {@link PROFILE_REQUEST_EVENT} to handle
         * 
         * @private
         */
        _profileRequest(event) {
          // Provide a copy of the current profile
          event.detail.callback(Object.assign({}, this._profile), this._attachedTo);

          // Stop further handling of this request
          event.stopImmediatePropagation();
        }
      }

      _export('default', ProfileStore);

      /**
       * The type of the {@link CustomEvent} that is triggered when a profile has been changed.
       * @type {String}
       */
      const PROFILE_CHANGED_EVENT = 'awcProfileChanged';

      /**
       * The type of {@link CustomEvent}s that represent a request to provide the current profile.
       */

      _export('PROFILE_CHANGED_EVENT', PROFILE_CHANGED_EVENT);

      const PROFILE_REQUEST_EVENT = 'awcProfileRequest';

      /**
       * A structured object describing the changes that occurred or have been made to a profile.
       * Each changed profile property is represented by its property name. The value of this property 
       * is an object with a <code>from</code> property representing the old value and a <code>to</code> 
       * property representing the new current value. If <code>from</code> is <code>null</code>, 
       * the property has just been added. Accordingly, if <code>to</code> is <code>null</code>, 
       * the property has been removed from the profile.
       * @typedef {Object.<String, ProfileChange>} ProfileDiff
       * 
       * @example
       * {
       *   changed: {from: 1, to: 5},
       *   new: {from: null, to: 'foo'},
       *   removed: {from: true, to: null}
       * }
       */

      /**
       * An object representing the value change of a profile property.
       * @typedef {Object} ProfileChange
       * @property {?Any} from the old value or <code>null</code>
       * @property {?Any} to the new value or <code>null</code>
       */

      _export('PROFILE_REQUEST_EVENT', PROFILE_REQUEST_EVENT);
    }
  };
});
$__System.register('6', ['3'], function (_export, _context) {
  "use strict";

  var PROFILE_CHANGED_EVENT, PROFILE_REQUEST_EVENT;


  /**   
   * @param {String} query
   * @private
   */
  function breakQueriesDown(query) {
    let arrayOfContexts = [],
        or = /\s*,\s*|\s*or\s*/i,
        orArr = query.split(or),
        lt = '<',
        gt = '>',
        lteq = '<=',
        gteq = '>=';
    for (let y of orArr) {
      let contextRuleObj = { contexts: [] },
          arrOfObj = [];
      let andArr = y.split(/\s*and\s*/i);
      for (let j of andArr) {
        let sr = j.substring(j.indexOf("(") + 1, j.indexOf(")")),
            ra,
            prcnt = '%',
            obj = {},
            objName,
            incdec;
        if (j.includes(lt) || j.includes(gt)) {
          if (sr.includes(lt) && sr.includes(gt)) {
            console.error('you have mixed the greater than and less than symbol in an expression!');
            return;
          }

          if (sr.includes(lt)) {
            if (sr.includes(lteq)) {
              ra = sr.split(lteq);
              incdec = mixedSigns(ra, lt);
            } else {
              ra = sr.split(lt);
              incdec = { left: true, right: true };
            }
            if (ra.length == 2) {
              if (ra[0].includes(prcnt) || !isNaN(ra[0])) {
                obj.min = parseFloat(ra[0]);
                obj.feature = ra[1].trim();
              } else {
                obj.max = parseFloat(ra[1]);
                obj.feature = ra[0].trim();
              }
            } else {
              obj.feature = ra[1].trim();
              obj.min = parseFloat(ra[0]);
              obj.max = parseFloat(ra[2]);
            }

            if (incdec.left || incdec.right) {
              obj.lt_gt = incdec;
            }
            arrOfObj.push(obj);
          }
          if (sr.includes(gt)) {
            if (sr.includes(gteq)) {
              ra = sr.split(gteq);
              incdec = mixedSigns(ra, gt);
            } else {
              ra = sr.split(gt);
              incdec = { left: true, right: true };
            }
            if (ra.length == 2) {
              if (ra[0].includes(prcnt) || !isNaN(ra[0])) {
                obj.max = parseFloat(ra[0]);
                obj.feature = ra[1].trim();
              } else {
                obj.min = parseFloat(ra[1]);
                obj.feature = ra[0].trim();
              }
            } else {
              obj.feature = ra[1].trim();
              obj.max = parseFloat(ra[0]);
              obj.min = parseFloat(ra[2]);
            }
            if (incdec.left || incdec.right) {
              obj.lt_gt = incdec;
            }
            arrOfObj.push(obj);
          }
        } else if (j.includes(':')) {
          let inner, a, objVal;
          inner = j.substring(j.indexOf("(") + 1, j.indexOf(")"));
          a = inner.split(/\s*:\s*/);
          objName = a[0].trim();
          obj.feature = objName;
          objVal = parseFloat(a[1]);

          if (objName.includes('min-') || objName.includes('max-')) {
            objName = objName.replace('min-', '');
            objName = objName.replace('max-', '');
            obj.feature = objName;
            if (arrOfObj.length == 0) {
              if (a[0].includes('min-')) {
                obj.min = objVal;
              }
              if (a[0].includes('max-')) {
                obj.max = objVal;
              }
              arrOfObj.push(obj);
            } else {
              for (let i of arrOfObj) {
                if (i.feature != obj.feature) {

                  if (a[0].includes('min-')) {
                    obj.min = objVal;
                  }
                  if (a[0].includes('max-')) {
                    obj.max = objVal;
                  }
                  arrOfObj.push(obj);
                } else {
                  if (a[0].includes('min-')) {
                    i.min = objVal;
                  }
                  if (a[0].includes('max-')) {
                    i.max = objVal;
                  }
                }
              }
            }
          } else {
            obj.abs = objVal;
            arrOfObj.push(obj);
          }
        } else {
          let inner = j.substring(j.indexOf("(") + 1, j.indexOf(")"));
          if (inner) {
            obj.feature = inner;
            obj.abs = true;
            arrOfObj.push(obj);
          }
        }
      }
      arrayOfContexts.push(arrOfObj);
    }
    return arrayOfContexts;
  }

  /**
   * @param {array} arr the resulting array after having splitted the query using <= or >=
   * @param {string} symbol the character to look up for in the passed array, either < or >
   * @private
   */
  function mixedSigns(arr, symbol) {
    let o = { left: false, right: false };
    if (arr.length == 2) {
      let left = false,
          tmpArr,
          tmpStr;
      for (let idx in arr) {
        // check if symbol is present, &lt; or &gt;
        if (arr[idx].includes(symbol)) {
          tmpStr = arr[idx];
          arr.splice(idx, 1);
          if (idx == 0) {
            left = true;
          }
        }
      }
      // if tmpStr has been assigned value
      if (tmpStr != undefined) {
        tmpArr = tmpStr.split(symbol);
        if (left) {
          arr.unshift(tmpArr[1]);
          arr.unshift(tmpArr[0]);
          if (symbol === '<') {
            o.left = true;
          } else {
            o.right = true;
          }
        } else {
          arr.push(tmpArr[0]);
          arr.push(tmpArr[1]);
          if (symbol === '<') {
            o.right = true;
          } else {
            o.left = true;
          }
        }
      }
    }
    return o;
  }

  /**
   * @param {*} structure The internal representation of the query expression as created by {@link breakQueriesDown}
   * @param {Object} context The current context
   * @returns {Boolean} <code>true</code> if the query matches the context, <code>false</code> otherwise.
   * @private
   */
  function determineMatch(structure, context) {
    let b = false;
    for (let j of structure) {
      let b2 = true;
      for (let k of j) {
        let min = Number.NEGATIVE_INFINITY,
            max = Number.POSITIVE_INFINITY;
        if (context.hasOwnProperty(k.feature)) {
          let value = context[k.feature];
          // has an unique value either numeric or boolean
          if (k.hasOwnProperty('abs')) {
            if (Number.isInteger(k.abs)) {
              if (value != k.abs) {
                b2 = false;
              }
            } else {
              if (!value) {
                b2 = false;
              }
            }
          } else {
            // Value is in range
            if (k.hasOwnProperty('min')) {
              min = k.min;
            }
            if (k.hasOwnProperty('max')) {
              max = k.max;
            }
            if (k.hasOwnProperty('lt_gt')) {
              if (k.lt_gt.left) {
                ++min;
              }
              if (k.lt_gt.right) {
                --max;
              }
            }
            if (min != -Infinity || max != Infinity) {
              if (value < min || max < value) {
                b2 = false;
              }
            }
          }
        } else {
          b2 = false;
        }
      }
      if (b2) {
        b = true;
      }
    }

    return b;
  }
  return {
    setters: [function (_) {
      PROFILE_CHANGED_EVENT = _.PROFILE_CHANGED_EVENT;
      PROFILE_REQUEST_EVENT = _.PROFILE_REQUEST_EVENT;
    }],
    execute: function () {

      /**
       * A <code>ContextQuery</code> object represents a context query expression, and handles sending notifications to 
       * listeners when the context query state changes (i.e. when it starts or stops matching the current context).
       * It mainly replicates the interface of 
       * {@link https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList MediaQueryList}.
       * 
       * @param {String} [query=""] The query expression this <code>ContextQuery</code> represents, defaults to empty string 
       *        and therefore a query that matches any context (always <code>true</code>).
       * @param {EventTarget} [attachTo=window] Specifies the node this <code>ContextQuery</code> will dispatch the
       *        {@link PROFILE_REQUEST_EVENT} to, defaults to <code>window</code>.
       */
      class ContextQuery {
        constructor(query = "", attachTo = window) {
          /**
           * The original query expression.
           * @member {String}
           * @private
           */
          this._query = query;

          /**
           * Node that is used for listening to profile changed events.
           * @member {EventTarget}
           * @private
           */
          this._attachedTo = attachTo;

          /**
           * List of event listeners grouped by event type.
           * @member {Object}
           * @private
           */
          this._listeners = {};

          /**
           * The listener function specified through the <code>onchange</code> property.
           * @member {Function}
           * @private
           */
          this._onchangeListener = null;

          /**
           * The internal structured representation of the parsed query expression.
           * @member {*}
           * @private
           */
          this._structuredQuery = ContextQuery.parse(this._query);

          /**
           * Flag that indicates if this query matches the most recent context.
           * @member {Boolean}
           * @private
           */
          this._matches = false;

          /**
           * Handler for {@link PROFILE_CHANGED_EVENT}s.
           * @member {Function}
           * @private
           */
          this._profileChangeHandler = event => {
            let profile = event.detail.current;
            this.prepareAdaptation(profile);
            this.performAdaptation(profile);
          };

          this._requestProfile();
        }

        /**
         * The original query expression.
         * @readonly
         * @returns {String} The original query expression.
         */
        get query() {
          return this._query;
        }

        /**
         * Checks if this <code>ContextQuery</code> matches the current context as known by the node it is attached to.
         * @readonly
         * @returns {Boolean} <code>true</code> if this query matches the current context, <code>false</code> if not.
         */
        get matches() {
          return this._matches;
        }

        /**
         * Sets a function as event handler for the <code>change</code> event, i.e. when the status of the query changes.
         * @param {Function} handler The function to be called on change with the event object as parameter or 
         *        <code>null</code> to remove the current handler.
         */
        set onchange(handler) {
          if (handler == null || typeof handler == 'function') {
            let previousListener = this._onchangeListener;
            this._onchangeListener = null;
            this.removeEventListener('change', this._onchangeListener);
            if (typeof handler === 'function') {
              this._onchangeListener = handler;
              this.addEventListener('change', this._onchangeListener);
            }
          }
        }

        /**
         * The function as event handler for the <code>change</code> event, i.e. when the status of the query changes.
         * @returns {Function} The function currently set as <code>change</code> event handler or <code>null</code> if no 
         *          current handler is set.
         */
        get onchange() {
          return this._onchangeListener;
        }

        /**
         * Add the specified function to the list of listeners to be called when an event of the specified type occurs.
         * This is basically an optionless version of 
         * {@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener EventTarget.addEventListener}.
         * @param {String} type A string representing the event type to listen for. Only <code>change</code> events are 
         *        expected to occur on <code>ContextQuery</code> objects.
         * @param {Function} listener The function to be called on change with the event object as parameter.
         */
        addEventListener(type, listener) {
          if (!(type in this._listeners)) {
            this._listeners[type] = [];
          }

          if (this._listeners[type].indexOf(listener) < 0) {
            this._listeners[type].push(listener);
          }
        }

        /**
         * Remove the specified function from the list of listeners to be called for the specified event type.
         * This is basically an optionless version of 
         * {@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener EventTarget.removeEventListener}.
         * @param {String} type A string which specifies the event type for which to remove a listener.
         * @param {Function} listener The listener function that should be removed from the list.
         */
        removeEventListener(type, listener) {
          if (type == 'change' && listener == this._onchangeListener) {
            return;
          }

          if (type in this._listeners && this._listeners[type].indexOf(listener) > -1) {
            this._listeners[type].splice(this._listeners[type].indexOf(listener), 1);
          }
        }

        /**
         * Dispatches the specified event.
         * @param {Event} event The event to dispatch.
         */
        dispatchEvent(event) {
          if (event.type in this._listeners) {
            for (let elm of this._listeners[event.type]) {
              elm.call(this, event);
            }
          }
        }

        /**
         * Prepares the adaptation of the component according to the given profile.
         * 
         * @param {Object} profile The profile to adapt to.
         */
        prepareAdaptation(profile) {}

        /**
         * Performes the adaptation of the component according to the given profile.
         * 
         * @param {Object} profile The profile to adapt to.
         */
        performAdaptation(profile) {
          let match = determineMatch(this._structuredQuery, profile);

          if (match != this._matches) {
            this._matches = match;
            this.dispatchEvent(new CustomEvent("change", { detail: { matches: this._matches, target: this } }));
          }
        }

        /**
         * Requests a profile by dispatching a {@link PROFILE_REQUEST_EVENT} to the {@link EventTarget} it has been attached to.
         * @private
         */
        _requestProfile() {
          this._attachedTo.dispatchEvent(new CustomEvent(PROFILE_REQUEST_EVENT, {
            bubbles: true, // bubbles along the DOM tree towards its root (i.e. window)
            composed: true, // bubbles across shadow DOM boundaries
            cancelable: true, // can be canceled by listeners
            detail: {
              callback: (profile, source) => {
                // Adapt to profile
                this.prepareAdaptation(profile);
                this.performAdaptation(profile);

                // Register to profile change events
                source.addEventListener(PROFILE_CHANGED_EVENT, this._profileChangeHandler);
              },
              managedCallback: manager => {}
            }
          }));
        }

        /**
         * 
         * @param {String} query 
         */
        static parse(query) {
          return breakQueriesDown(query);
        }
      }

      _export('default', ContextQuery);

      // Patch factory function into window object
      window.matchContext = function (expression) {
        return new ContextQuery(expression, window);
      };
    }
  };
});
$__System.registerDynamic('7', [], false, function ($__require, $__exports, $__module) {
    var _retrieveGlobal = $__System.get("@@global-helpers").prepareGlobal($__module.id, null, null);

    (function ($__global) {
        /*
         * Copyright (C) 2017 Fraunhofer IAO
         * All rights reserved.
         *
         * This software may be modified and distributed under the terms
         * of the Clear BSD license.  See the LICENSE file for details.
         */

        document.addEventListener(window.WebComponents && !window.WebComponents.ready ? 'WebComponentsReady' : 'DOMContentLoaded', function () {
            /**
             * The <code>context-style</code> custom element polyfills CSS <code>@context</code> rules.
             */
            class ContextStyle extends HTMLElement {

                constructor() {
                    super();
                    this._arrayOfQueries = [];
                    this._host = document.querySelector("html");
                    this._head = document.querySelector('head');
                    this._contextQueryObjectList = [];
                }

                connectedCallback() {
                    this.style.display = 'none';
                    if (this.parentNode.host != undefined) {
                        if (!this.parentNode.host.shadowRoot.querySelector('slot')) {
                            this._host = this.parentNode.host;
                            this._head = this._host.shadowRoot;
                        }
                    }
                    this.getHrefAttr();
                }

                disconnectedCallback() {
                    for (let i in this._contextQueryObjectList) {
                        if (this._contextQueryObjectList[i]._intervalID != undefined) {
                            clearInterval(this._contextQueryObjectList[i]._intervalID);
                        }
                        this._contextQueryObjectList[i] = null;
                        delete this._contextQueryObjectList[i];
                    }
                    for (let j of this._arrayOfQueries) {
                        this._host.classList.remove(j.class);
                    }
                    this._contextQueryObjectList.length = 0;
                }

                /**
                 * @param {string} attr - the query from the "context" attribute   
                 */
                getContent(attr) {
                    let inner = this.innerHTML;
                    if (inner.trim() != '') {
                        inner = inner.replace(/&gt;/g, '>').replace(/&lt;/g, '<');
                        this.instantiateContextQueryObjects(inner.trim(), attr);
                    } else {
                        console.error('Context-Styles have not been declared, please use the href attribute or write them directly in the context-style tag.');
                    }
                }

                getHrefAttr() {
                    let attr = false;
                    if (this.hasAttribute('context') && this.getAttribute('context') != "") {
                        attr = this.getAttribute('context');
                    }
                    if (this.hasAttribute('href') && this.getAttribute('href') != "") {
                        this.getURL(this.getAttribute('href')).then(response => {
                            this.instantiateContextQueryObjects(response, attr);
                        }, error => {
                            console.error("Failed!", error);
                        });
                    } else {
                        this.getContent(attr);
                    }
                }

                /**   
                 * @param {string} url - the link to an external context query sheet
                 */

                getURL(url) {
                    return new Promise(function (resolve, reject) {
                        var req = new XMLHttpRequest();
                        req.open('GET', url);
                        req.onload = function () {
                            if (req.status == 200) {
                                resolve(req.response);
                            } else {
                                reject(Error(req.statusText));
                            }
                        };
                        req.onerror = function () {
                            reject(Error("Network Error"));
                        };
                        req.send();
                    });
                }

                /**
                 * @param {string} str the styles found inside the <context-style> custom element
                 * @param {string} attr the query of the "context" attribute 
                 */

                instantiateContextQueryObjects(str, attr) {
                    this.factoriseContextQueries(str, attr);
                    for (let contextQuery of this._arrayOfQueries) {
                        // Generate unique class;
                        const cssClass = 'css-ctx-queries-' + Math.round(Math.random() * new Date()).toString(16);
                        contextQuery.class = cssClass;
                        // Instantiate Object with new constructor
                        let cqo = window.matchContext(contextQuery.expression),
                            css = "";
                        cqo.onchange = e => {
                            if (e != undefined) {
                                console.log(e);
                            }
                            if (cqo.matches) {
                                if (!this._host.classList.contains(cssClass)) {
                                    this._host.classList.add(cssClass);
                                }
                            } else {
                                if (this._host.classList.contains(cssClass)) {
                                    this._host.classList.remove(cssClass);
                                }
                            }
                        };
                        cqo.onchange();

                        this._contextQueryObjectList.push(cqo);

                        for (let style of contextQuery.styles) {
                            let key = style.selector;
                            if (this._host.shadowRoot != undefined) {
                                if (!this._host.shadowRoot.querySelector('slot')) {
                                    if (key == ':host') {
                                        css += ':host(.' + cssClass + ') ' + '{' + style.properties + '}';
                                    } else {
                                        css += ':host(.' + cssClass + ') ' + key.replace('&gt;', '>') + '{' + style.properties + '}';
                                    }
                                } else {
                                    css += '.' + cssClass + ' ' + this._host.localName + ' ' + key.replace('&gt;', '>') + '{' + style.properties + '}';
                                }
                            } else {
                                if (key === 'html') {
                                    css += key + '.' + cssClass + '{' + style.properties + '}';
                                } else {
                                    css += '.' + cssClass + ' ' + key.replace('&gt;', '>') + '{' + style.properties + '}';
                                }
                            }
                        }

                        if (this._head.querySelector('#cssCtxQueriesStyleTag')) {
                            this._head.querySelector('#cssCtxQueriesStyleTag').appendChild(document.createTextNode(css));
                        } else {
                            let style = document.createElement('style');
                            style.id = 'cssCtxQueriesStyleTag';
                            style.appendChild(document.createTextNode(css));
                            this._head.appendChild(style);
                        }
                    }
                }

                /**
                 * @param {string} brackets the type of brackets as pair [],{},()
                 * @param {string} str the string where the brackets are to be found 
                 */

                findClosingBracket(brackets, str) {
                    let c = str.indexOf(brackets[0], str.indexOf('@context'));
                    let i = 1;
                    while (i > 0) {
                        let b = str[++c];
                        if (b == brackets[0]) {
                            i++;
                        } else if (b == brackets[1]) {
                            i--;
                        }
                    }
                    return c;
                }

                /**
                 * @param {string} str - the content of the <context-style> custom element
                 * @param {string} attr - the content of the context attribute, false if the context attribute is empty
                 */

                factoriseContextQueries(str, attr) {
                    if (str.includes('@context')) {
                        let sbstrng = str.substring(str.indexOf("@context"), this.findClosingBracket('{}', str) + 1);
                        let str2 = str.replace(sbstrng, '');
                        str2 = str2.trim();
                        this._arrayOfQueries.push(sbstrng);
                        this.factoriseContextQueries(str2, attr);
                    } else {
                        // push the query from the context attribute into _arrayOfQueries
                        if (attr != false) {
                            this._arrayOfQueries.push('@context ' + attr + ' {' + str + '}');
                        }
                        let newArrayOfQueries = [];
                        for (let elm of this._arrayOfQueries) {
                            let expression = elm.substring(8, elm.indexOf('{'));
                            let styles = elm.substring(elm.indexOf('{') + 1, elm.lastIndexOf('}'));
                            let arrayOfSelectors = [],
                                singleStyles = styles.split(/\s*}\s*/);
                            for (let z of singleStyles) {
                                let classes, attrs, classArr;
                                classes = z.substring(0, z.indexOf("{"));
                                attrs = z.substring(z.indexOf("{") + 1);
                                classArr = classes.split(/\s*,\s*/);
                                for (let sc of classArr) {
                                    let obj = { selector: sc.trim(), properties: attrs.trim() };
                                    if (obj.selector != "" || obj.properties !== "") {
                                        arrayOfSelectors.push(obj);
                                    }
                                }
                            }

                            newArrayOfQueries.push({ expression: expression.trim(), styles: arrayOfSelectors });
                        }

                        // factorise all objects in _arrayOfQueries only if there's a global query and more than one query in total 
                        if (attr != false) {
                            let globalQuery = newArrayOfQueries[newArrayOfQueries.length - 1].expression;
                            for (let i = 0; i < newArrayOfQueries.length - 1; i++) {
                                newArrayOfQueries[i].expression += ' and ' + globalQuery;
                            }
                        }
                        this._arrayOfQueries = [];
                        // reorganise arrayOfQueries
                        for (let i of newArrayOfQueries) {
                            if (i.styles.length > 0) {
                                this._arrayOfQueries.push(i);
                            }
                        }
                    }
                }

            }

            window.customElements.define('context-style', ContextStyle);
        });
    })(this);

    return _retrieveGlobal();
});
$__System.register('1', ['2', '4', '3', '5', '6', '7'], function (_export, _context) {
  "use strict";

  var AdaptiveComponent, AdaptiveVariant, ProfileStore, LocalProfileStore, ContextQuery, ContextStyle;
  return {
    setters: [function (_) {
      AdaptiveComponent = _.default;
    }, function (_2) {
      AdaptiveVariant = _2.default;
    }, function (_3) {
      ProfileStore = _3.default;
    }, function (_4) {
      LocalProfileStore = _4.default;
    }, function (_5) {
      ContextQuery = _5.default;
    }, function (_6) {
      ContextStyle = _6.default;
    }],
    execute: function () {
      _export('AdaptiveComponent', AdaptiveComponent);

      _export('AdaptiveVariant', AdaptiveVariant);

      _export('ProfileStore', ProfileStore);

      _export('LocalProfileStore', LocalProfileStore);

      _export('ContextQuery', ContextQuery);
    }
  };
});
})
(function(factory) {
  if (typeof define == 'function' && define.amd)
    define([], factory);
  else if (typeof module == 'object' && module.exports && typeof require == 'function')
    module.exports = factory();
  else
    awc = factory();
});