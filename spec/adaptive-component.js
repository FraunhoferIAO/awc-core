/*
 * Copyright (C) 2017 Fraunhofer IAO
 * All rights reserved.
 *
 * This software may be modified and distributed under the terms
 * of the Clear BSD license.  See the LICENSE file for details.
 */

import AdaptiveComponent from 'adaptive-component.js';
import {PROFILE_CHANGED_EVENT, PROFILE_REQUEST_EVENT} from 'profilestore.js';

describe('The AdaptiveComponent', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null;
  });

  describe('statically manages its variants on type level', () => {
    let type;

    beforeEach(() => {
      type = AdaptiveComponent(HTMLElement);
    });

    it('initially has no default variant', () => {
      // Arrange
      // Act
      // Assert
      expect(type.defaultVariant).toBe(null);
    });

    it('uses the only registered variant as default', () => {
      // Arrange
      let variant1 = { name: 'variant1' };
      
      // Act
      type.registerVariant(variant1);

      // Assert
      expect(type.defaultVariant).toBe(variant1);
    });

    it('uses the first registered variant as default', () => {
      // Arrange
      let variant1 = { name: 'variant1' }, variant2 = { name: 'variant2' };
      
      // Act
      type.registerVariant(variant1);
      type.registerVariant(variant2);

      // Assert
      expect(type.defaultVariant).toBe(variant1);
    });

    it('allows to explicitly define another default variant', () => {
      // Arrange
      let variant1 = { name: 'variant1' }, variant2 = { name: 'variant2' };
      type.registerVariant(variant1);
      type.registerVariant(variant2);
      
      // Act
      type.defaultVariant = variant2;

      // Assert
      expect(type.defaultVariant).toBe(variant2);
    });

    it('permits to set a non-registered variant as default', () => {
      // Arrange
      let variant1 = { name: 'variant1' }, variant2 = { name: 'variant2' };
      type.registerVariant(variant1);

      // Act
      let illegalAction = () => {
        type.defaultVariant = variant2;
      };

      // Assert
      expect(illegalAction).toThrowError();
      expect(type.defaultVariant).toBe(variant1);
    });
  });

  describe('reflects attributes and properties', () => {
    const ELEMENT_NAME = 'attributes-' + Date.now();
    let type, element;

    beforeAll(() => {
      // Create component type
      type = AdaptiveComponent(HTMLElement);

      // Define custom element
      customElements.define(ELEMENT_NAME, type);
    });

    beforeEach(() => {
      // Create element instance
      element = document.createElement(ELEMENT_NAME);
    });

    it('by observing them', () => {
      // Arrange
      // Act
      let attributes = type.observedAttributes;

      // Assert
      expect(attributes).toContain('awc-managing');
    });

    xit('attribute "awc-managing" to property "managing"', () => {
      // Arrange
      // Act
      element.setAttribute('awc-managing', '');

      // Assert
      expect(element.managing).toBeTruthy();

      // Act
      element.removeAttribute('awc-managing');

      // Assert
      expect(element.managing).toBeFalsy();
    });

    xit('property "managing" to attribute "awc-managing"' ,() => {
      // Arrange
      // Act
      element.managing = true;

      // Assert
      expect(element.hasAttribute('awc-managing')).toBeTruthy();

      // Act
      element.managing = false;

      // Assert
      expect(element.hasAttribute('awc-managing')).toBeFalsy();
    });
  });

  describe('in its lifecycle', () => {
    const ELEMENT_NAME = 'lifecycle-' + Date.now();
    const VARIANT_COUNT = 4, VARIANT_DEFAULT = 1;
    const VARIANT_STATE = { foo: 'baz' };
    let variantTypes;

    beforeAll(() => {
      // Create component type
      let type = AdaptiveComponent(HTMLElement);

      // Create and register variant type spies
      variantTypes = [];
      for (var i = 0; i < VARIANT_COUNT; i++) {
        variantTypes[i] = jasmine.createSpy(`Variant${i} constructor`, { });
        variantTypes[i]['matches'] = jasmine.createSpy(`Variant${i} matches`);
        variantTypes[i].prototype['selectedCallback'] = jasmine.createSpy(`Variant${i}.selectedCallback`);
        variantTypes[i].prototype['deselectedCallback'] = jasmine.createSpy(`Variant${i}.deselectedCallback`).and.returnValue(VARIANT_STATE);
        variantTypes[i].prototype['connectedCallback'] = jasmine.createSpy(`Variant${i}.connectedCallback`);
        variantTypes[i].prototype['disconnectedCallback'] = jasmine.createSpy(`Variant${i}.disconnectedCallback`);
        type.registerVariant(variantTypes[i]);
      }

      // Define default variant
      type.defaultVariant = variantTypes[VARIANT_DEFAULT];

      // Define custom element
      customElements.define(ELEMENT_NAME, type);
    });
    
    afterEach(() => {
      // Recreate variant type match spies since behavior (e.g. return value) might change in individual specs
      for (var i = 0; i < variantTypes.length; i++) {
        variantTypes[i]['matches'] = jasmine.createSpy(`Variant${i} matches`);
      }
    });

    describe('initializes', () => {
      it('with no variant selected', () => {
        // Arrange
        // Act
        let element = document.createElement(ELEMENT_NAME);

        // Assert
        expect(element.variant).toBe(null);
      });

      it('in self-adaptive (not managed) mode', () => {
        // Arrange
        // Act
        let element = document.createElement(ELEMENT_NAME);

        // Assert
        expect(element.managed).toBeFalsy();
      });

      it('in transparent (non-managing) mode', () => {
        // Arrange
        // Act
        let element = document.createElement(ELEMENT_NAME);

        // Assert
        expect(element.managing).toBeFalsy();
        expect(element.hasAttribute('awc-managing')).toBeFalsy();
      });
    });

    describe('when connected', () => {
      let element;

      beforeEach(() => {
        element = document.createElement(ELEMENT_NAME);
      });

      it('warns on the console if there are no variants registered', () => {
        const ELEMENT_NAME_NOVARIANTS = 'no-variants-' + Date.now();

        // Arrange
        customElements.define(ELEMENT_NAME_NOVARIANTS, AdaptiveComponent(HTMLElement));
        spyOn(console, 'warn');

        // Act
        container.appendChild(document.createElement(ELEMENT_NAME_NOVARIANTS));

        // Assert
        expect(console.warn).toHaveBeenCalledTimes(1);
        expect(console.warn.calls.mostRecent().args[0]).toContain(ELEMENT_NAME_NOVARIANTS);
      });

      it('immediately selects its default variant', () => {
        // Arrange
        // Act
        container.appendChild(element);
        
        // Assert
        for (var i = 0; i < variantTypes.length; i++) {
          expect(variantTypes[i].matches).toHaveBeenCalledTimes(1);
          if (i == VARIANT_DEFAULT) {
            expect(variantTypes[i]).toHaveBeenCalledTimes(1);
          } else {
            expect(variantTypes[i]).not.toHaveBeenCalled();
          }
        }
        let variantInstance = variantTypes[VARIANT_DEFAULT].calls.all()[0].object;
        expect(element.variant).toBe(variantInstance);
        expect(variantInstance.selectedCallback).toHaveBeenCalledTimes(1);
        expect(variantInstance.selectedCallback).toHaveBeenCalledWith({});
        expect(variantInstance.connectedCallback).toHaveBeenCalledTimes(1);
        expect(variantInstance.deselectedCallback).not.toHaveBeenCalled();
        expect(variantInstance.disconnectedCallback).not.toHaveBeenCalled();
      });
      
      it('dispatches a bubbling profile request event to itself', () => {
        // Arrange
        let eventSpy = jasmine.createSpy('EventHandler');
        element.addEventListener(PROFILE_REQUEST_EVENT, eventSpy);

        // Act
        container.appendChild(element);

        // Assert
        expect(eventSpy).toHaveBeenCalledTimes(1);
        expect(eventSpy.calls.mostRecent().args[0]).toEqual(jasmine.any(CustomEvent));
        let event = eventSpy.calls.mostRecent().args[0];
        expect(event.type).toEqual(PROFILE_REQUEST_EVENT);
        expect(event.bubbles).toBeTruthy('bubbles');
        expect(event.composed).toBeTruthy('composed');
        expect(event.cancelable).toBeTruthy('cancelable');
        expect(event.detail.callback).toEqual(jasmine.any(Function));
        expect(event.detail.callback.length).toEqual(2);
        expect(event.detail.managedCallback).toEqual(jasmine.any(Function));
        expect(event.detail.managedCallback.length).toEqual(1);

        // Clean up
        element.removeEventListener(PROFILE_REQUEST_EVENT, eventSpy);
      });

      it('stays in self-adaptive mode when provided with a profile', () => {
        // Arrange
        spyOn(element, 'dispatchEvent');
        container.appendChild(element);
        let callback = element.dispatchEvent.calls.mostRecent().args[0].detail.callback;
        
        // Act
        callback({foo: 'bar'}, container);
        
        // Assert
        expect(element.managed).toBeFalsy();
      });

      it('switches to managed mode when provided with a manager component', () => {
        // Arrange
        container['removeManagedComponent'] = jasmine.createSpy('removeManagedComponent');
        spyOn(element, 'dispatchEvent');
        container.appendChild(element);
        let managedCallback = element.dispatchEvent.calls.mostRecent().args[0].detail.managedCallback;
        
        // Act
        managedCallback(container);
        
        // Assert
        expect(element.managed).toBeTruthy();
      });

      describe('in self-adaptive mode', () => {
        let callback, previousVariantInstance;

        beforeEach(() => {
          // Spy on element's dispatchEvent
          spyOn(element, 'dispatchEvent');

          // Append to container and store callback function provided in the profile request event
          container.appendChild(element);
          callback = element.dispatchEvent.calls.mostRecent().args[0].detail.callback;

          // Store the current variant and reset all of its spies
          previousVariantInstance = element.variant;
          previousVariantInstance.selectedCallback.calls.reset();
          previousVariantInstance.connectedCallback.calls.reset();
          previousVariantInstance.deselectedCallback.calls.reset();
          previousVariantInstance.disconnectedCallback.calls.reset();
          for (var i = 0; i < variantTypes.length; i++) {
            variantTypes[i].calls.reset();
            variantTypes[i].matches.calls.reset();
          }
        });

        it('switches to the first matching variant when provided with the requested profile', () => {
          // Arrange
          const VARIANT_MATCHING = 2;
          variantTypes[VARIANT_MATCHING]['matches'] = jasmine.createSpy(`Variant${VARIANT_MATCHING} matches`).and.returnValue(true);

          // Act
          callback({foo: 'bar'}, container);

          // Assert
          for (var i = 0; i < variantTypes.length; i++) {
            if (i <= VARIANT_MATCHING) {
              expect(variantTypes[i].matches).toHaveBeenCalledTimes(1);
            } else {
              expect(variantTypes[i].matches).not.toHaveBeenCalled();
            }
            
            if (i == VARIANT_MATCHING) {
              expect(variantTypes[i]).toHaveBeenCalledTimes(1);
            } else {
              expect(variantTypes[i]).not.toHaveBeenCalled();
            }
          }

          let variantInstance = variantTypes[VARIANT_MATCHING].calls.all()[0].object;
          expect(element.variant).toBe(variantInstance);
          expect(variantInstance.selectedCallback).toHaveBeenCalledTimes(1);
          expect(variantInstance.selectedCallback).toHaveBeenCalledWith(VARIANT_STATE);
          expect(variantInstance.connectedCallback).toHaveBeenCalledTimes(1);
          expect(variantInstance.deselectedCallback).not.toHaveBeenCalled();
          expect(variantInstance.disconnectedCallback).not.toHaveBeenCalled();
          expect(previousVariantInstance.selectedCallback).not.toHaveBeenCalled();
          expect(previousVariantInstance.connectedCallback).not.toHaveBeenCalled();
          expect(previousVariantInstance.deselectedCallback).toHaveBeenCalledTimes(1);
          expect(previousVariantInstance.disconnectedCallback).toHaveBeenCalledTimes(1);
        });

        it('does nothing if the provided profile results in the default variant again', () => {
          // Arrange
          const VARIANT_MATCHING = VARIANT_DEFAULT;
          variantTypes[VARIANT_MATCHING]['matches'] = jasmine.createSpy(`Variant${VARIANT_MATCHING} matches`).and.returnValue(true);

          // Act
          callback({foo: 'bar'}, container);

          // Assert
          for (var i = 0; i < variantTypes.length; i++) {
            if (i <= VARIANT_MATCHING) {
              expect(variantTypes[i].matches).toHaveBeenCalledTimes(1);
            } else {
              expect(variantTypes[i].matches).not.toHaveBeenCalled();
            }
            
            expect(variantTypes[i]).not.toHaveBeenCalled();
          }

          expect(element.variant).toBe(previousVariantInstance);
          expect(previousVariantInstance.selectedCallback).not.toHaveBeenCalled();
          expect(previousVariantInstance.connectedCallback).not.toHaveBeenCalled();
          expect(previousVariantInstance.deselectedCallback).not.toHaveBeenCalled();
          expect(previousVariantInstance.disconnectedCallback).not.toHaveBeenCalled();
        });

        it('listens to profile changed events on the detected profile source', () => {
          // Arrange
          let eventNode = {
            addEventListener: jasmine.createSpy('addEventListener'),
            removeEventListener: jasmine.createSpy('removeEventListener')
          };

          // Act
          callback({foo: 'bar'}, eventNode);

          // Assert
          expect(eventNode.addEventListener).toHaveBeenCalledTimes(1);
          expect(eventNode.addEventListener).toHaveBeenCalledWith(PROFILE_CHANGED_EVENT, jasmine.any(Function));
        });
      });

      describe('in managed mode', () => {
        let managedCallback, previousVariantInstance;

        beforeEach(() => {
          // Add removeManagedComponent method spy
          container['removeManagedComponent'] = jasmine.createSpy('removeManagedComponent');
          
          // Spy on element's dispatchEvent
          spyOn(element, 'dispatchEvent');

          // Append to container and store callback function provided in the profile request event
          container.appendChild(element);
          managedCallback = element.dispatchEvent.calls.mostRecent().args[0].detail.managedCallback;

          // Store the current variant and reset all of its spies
          previousVariantInstance = element.variant;
          previousVariantInstance.selectedCallback.calls.reset();
          previousVariantInstance.connectedCallback.calls.reset();
          previousVariantInstance.deselectedCallback.calls.reset();
          previousVariantInstance.disconnectedCallback.calls.reset();
          for (var i = 0; i < variantTypes.length; i++) {
            variantTypes[i].calls.reset();
            variantTypes[i].matches.calls.reset();
            variantTypes[i].prototype.selectedCallback.calls.reset();
            variantTypes[i].prototype.connectedCallback.calls.reset();
            variantTypes[i].prototype.deselectedCallback.calls.reset();
            variantTypes[i].prototype.disconnectedCallback.calls.reset();
          }
        });

        it('does not change its variant when set to managed mode', () => {
          // Arrange
          // Act
          managedCallback(container);
          
          // Assert
          for (var i = 0; i < variantTypes.length; i++) {
            expect(variantTypes[i].matches).not.toHaveBeenCalled();          
            expect(variantTypes[i]).not.toHaveBeenCalled();
          }
        });

        it('selects the first matching variant when prepared to adapt', () => {
          // Arrange
          const VARIANT_MATCHING = 2;
          variantTypes[VARIANT_MATCHING]['matches'] = jasmine.createSpy(`Variant${VARIANT_MATCHING} matches`).and.returnValue(true);
          managedCallback(container);
          
          // Act
          element.prepareAdaptation({ foo: 'bar' });
          
          // Assert
          for (var i = 0; i < variantTypes.length; i++) {
            if (i <= VARIANT_MATCHING) {
              expect(variantTypes[i].matches).toHaveBeenCalledTimes(1);
            } else {
              expect(variantTypes[i].matches).not.toHaveBeenCalled();
            }
            
            if (i == VARIANT_MATCHING) {
              expect(variantTypes[i]).toHaveBeenCalledTimes(1);
            } else {
              expect(variantTypes[i]).not.toHaveBeenCalled();
            }
          }

          let variantInstance = variantTypes[VARIANT_MATCHING].calls.all()[0].object;
          expect(variantInstance.selectedCallback).toHaveBeenCalledTimes(1);
          expect(variantInstance.selectedCallback).toHaveBeenCalledWith(VARIANT_STATE);
          expect(variantInstance.connectedCallback).not.toHaveBeenCalled();
          expect(variantInstance.deselectedCallback).not.toHaveBeenCalled();
          expect(variantInstance.disconnectedCallback).not.toHaveBeenCalled();
          expect(element.variant).toBe(previousVariantInstance);
          expect(previousVariantInstance.selectedCallback).not.toHaveBeenCalled();
          expect(previousVariantInstance.connectedCallback).not.toHaveBeenCalled();
          expect(previousVariantInstance.deselectedCallback).toHaveBeenCalledTimes(1);
          expect(previousVariantInstance.disconnectedCallback).not.toHaveBeenCalled();
        });

        it('does not select the current variant again', () => {
          // Arrange
          const VARIANT_MATCHING = VARIANT_DEFAULT;
          variantTypes[VARIANT_MATCHING]['matches'] = jasmine.createSpy(`Variant${VARIANT_MATCHING} matches`).and.returnValue(true);
          managedCallback(container);
          
          // Act
          element.prepareAdaptation({ foo: 'bar' });
          
          // Assert
          for (var i = 0; i < variantTypes.length; i++) {
            if (i <= VARIANT_MATCHING) {
              expect(variantTypes[i].matches).toHaveBeenCalledTimes(1);
            } else {
              expect(variantTypes[i].matches).not.toHaveBeenCalled();
            }
            
            expect(variantTypes[i]).not.toHaveBeenCalled();
          }

          expect(element.variant).toBe(previousVariantInstance);
          expect(previousVariantInstance.selectedCallback).not.toHaveBeenCalled();
          expect(previousVariantInstance.connectedCallback).not.toHaveBeenCalled();
          expect(previousVariantInstance.deselectedCallback).not.toHaveBeenCalled();
          expect(previousVariantInstance.disconnectedCallback).not.toHaveBeenCalled();
        });

        it('switches the prepared variant when told to perform adaptation', () => {
          // Arrange
          const VARIANT_MATCHING = 2;
          variantTypes[VARIANT_MATCHING]['matches'] = jasmine.createSpy(`Variant${VARIANT_MATCHING} matches`).and.returnValue(true);
          managedCallback(container);
          element.prepareAdaptation({ foo: 'bar' });
          let variantInstance = variantTypes[VARIANT_MATCHING].calls.all()[0].object;
          for (var i = 0; i < variantTypes.length; i++) {
            variantTypes[i].calls.reset();
            variantTypes[i].matches.calls.reset();
            variantTypes[i].prototype.selectedCallback.calls.reset();
            variantTypes[i].prototype.connectedCallback.calls.reset();
            variantTypes[i].prototype.deselectedCallback.calls.reset();
            variantTypes[i].prototype.disconnectedCallback.calls.reset();
          }
          
          // Act
          element.performAdaptation({ foo: 'bar' });
          
          // Assert
          for (var i = 0; i < variantTypes.length; i++) {
            expect(variantTypes[i].matches).not.toHaveBeenCalled();
            expect(variantTypes[i]).not.toHaveBeenCalled();
          }
          expect(element.variant).toBe(variantInstance);
          expect(variantInstance.selectedCallback).not.toHaveBeenCalled();
          expect(variantInstance.connectedCallback).toHaveBeenCalledTimes(1)
          expect(variantInstance.deselectedCallback).not.toHaveBeenCalled();
          expect(variantInstance.disconnectedCallback).not.toHaveBeenCalled();
          expect(previousVariantInstance.selectedCallback).not.toHaveBeenCalled();
          expect(previousVariantInstance.connectedCallback).not.toHaveBeenCalled();
          expect(previousVariantInstance.deselectedCallback).not.toHaveBeenCalled();
          expect(previousVariantInstance.disconnectedCallback).toHaveBeenCalledTimes(1);
        });

        it('performs no adaptation if no variant has been prepared', () => {
          // Arrange
          managedCallback(container);
          
          // Act
          element.performAdaptation({ foo: 'bar' });
          
          // Assert
          for (var i = 0; i < variantTypes.length; i++) {
            expect(variantTypes[i].matches).not.toHaveBeenCalled();
            expect(variantTypes[i]).not.toHaveBeenCalled();
          }
          expect(element.variant).toBe(previousVariantInstance);
          expect(previousVariantInstance.selectedCallback).not.toHaveBeenCalled();
          expect(previousVariantInstance.connectedCallback).not.toHaveBeenCalled();
          expect(previousVariantInstance.deselectedCallback).not.toHaveBeenCalled();
          expect(previousVariantInstance.disconnectedCallback).not.toHaveBeenCalled();
        });
      });
    });

    describe('when disconnected', () => {
      let element;

      beforeEach(() => {
        element = document.createElement(ELEMENT_NAME);
      });

      describe('in self-adaptive mode', () => {
        let eventNode, profileHandler;

        beforeEach(() => {
          spyOn(element, 'dispatchEvent');
          container.appendChild(element);
          let callback = element.dispatchEvent.calls.mostRecent().args[0].detail.callback;
          eventNode = {
            addEventListener: jasmine.createSpy('addEventListener'),
            removeEventListener: jasmine.createSpy('removeEventListener')
          };
          callback({foo: 'bar'}, eventNode);
          profileHandler = eventNode.addEventListener.calls.mostRecent().args[1];
          eventNode.addEventListener.calls.reset();
          eventNode.removeEventListener.calls.reset();
        });

        it('removes its profile changed listener', () => {
          // Arrange
          // Act
          container.removeChild(element);

          // Assert
          expect(eventNode.removeEventListener).toHaveBeenCalledTimes(1);
          expect(eventNode.removeEventListener).toHaveBeenCalledWith(PROFILE_CHANGED_EVENT, profileHandler);
        });
      });

      describe('in managed mode', () => {
        beforeEach(() => {
          container['removeManagedComponent'] = jasmine.createSpy('removeManagedComponent');
          spyOn(element, 'dispatchEvent');
          container.appendChild(element);
          let managedCallback = element.dispatchEvent.calls.mostRecent().args[0].detail.managedCallback;
          managedCallback(container);
        });

        it('notifies its managing component', () => {
          // Arrange
          // Act
          container.removeChild(element);

          // Assert
          expect(container.removeManagedComponent).toHaveBeenCalledTimes(1);
          expect(container.removeManagedComponent).toHaveBeenCalledWith(element);
        });
      });
    });

    describe('when reconnected', () => {
      const VARIANT_MATCHING = 2;
      let newContainer, element, eventNode, eventSpy, previousVariantInstance;

      beforeEach(() => {
        // Create
        element = document.createElement(ELEMENT_NAME);
        eventNode = {
          addEventListener: jasmine.createSpy('addEventListener'),
          removeEventListener: jasmine.createSpy('removeEventListener')
        };

        // Connect
        eventSpy = jasmine.createSpy('EventHandler');
        element.addEventListener(PROFILE_REQUEST_EVENT, eventSpy);
        container.appendChild(element);
        let callback = eventSpy.calls.mostRecent().args[0].detail.callback;
        callback({foo: 'bar'}, eventNode);

        // Disconnect
        container.removeChild(element);

        // Create new container
        newContainer = document.createElement('div');
        container.appendChild(newContainer);

        // Reset spies
        eventSpy.calls.reset();
        eventNode.addEventListener.calls.reset();
        eventNode.removeEventListener.calls.reset();
        previousVariantInstance = element.variant;
        previousVariantInstance.selectedCallback.calls.reset();
        previousVariantInstance.connectedCallback.calls.reset();
        previousVariantInstance.deselectedCallback.calls.reset();
        previousVariantInstance.disconnectedCallback.calls.reset();
        for (var i = 0; i < variantTypes.length; i++) {
          variantTypes[i].calls.reset();
          variantTypes[i].matches.calls.reset();
        }
      });

      afterEach(() => {
        element.removeEventListener(PROFILE_REQUEST_EVENT, eventSpy);
      });

      it('sticks to its last selected variant', () => {
        // Arrange
        // Act
        newContainer.appendChild(element);

        // Assert
        for (var i = 0; i < variantTypes.length; i++) {
          expect(variantTypes[i].matches).not.toHaveBeenCalled();
          expect(variantTypes[i]).not.toHaveBeenCalled();
        }
        expect(element.variant).toBe(previousVariantInstance);
        expect(previousVariantInstance.selectedCallback).not.toHaveBeenCalled();
        expect(previousVariantInstance.connectedCallback).not.toHaveBeenCalled();
        expect(previousVariantInstance.deselectedCallback).not.toHaveBeenCalled();
        expect(previousVariantInstance.disconnectedCallback).not.toHaveBeenCalled();
      });

      it('dispatches a new profile request event', () => {
        // Arrange
        // Act
        newContainer.appendChild(element);

        // Assert
        expect(eventSpy).toHaveBeenCalledTimes(1);
        expect(eventSpy).toHaveBeenCalledWith(jasmine.any(CustomEvent));
        let event = eventSpy.calls.mostRecent().args[0];
        expect(event.type).toEqual(PROFILE_REQUEST_EVENT);
        expect(event.bubbles).toBeTruthy('bubbles');
        expect(event.composed).toBeTruthy('composed');
        expect(event.cancelable).toBeTruthy('cancelable');
        expect(event.detail.callback).toEqual(jasmine.any(Function));
        expect(event.detail.callback.length).toEqual(2);
      });
    });
  });

  xdescribe('when in managing mode', () => {
    const ELEMENT_NAME = 'managing-' + Date.now();
    const INITIAL_PROFILE = { foo: 'bar' };
    let element;

    beforeAll(() => {
      // Create component type
      let type = AdaptiveComponent(HTMLElement);

      // Add default variant
      type.registerVariant(DEFAULT_VARIANT_TYPE);

      // Define custom element
      customElements.define(ELEMENT_NAME, type);
    });

    beforeEach(() => {
      // Create element instance
      element = document.createElement(ELEMENT_NAME);

      // Set element to managing mode
      element.managing = true;

      // Initialize element with INITIAL_PROFILE
      spyOn(element, 'dispatchEvent');
      container.appendChild(element);
      element.dispatchEvent.calls.mostRecent().args[0].detail.callback(INITIAL_PROFILE, container);
    });

    it('listens to profile request and disconnection events in its shadow DOM', () => {
      // Arrange
      element = document.createElement(ELEMENT_NAME);
      spyOn(element.shadowRoot, 'addEventListener');

      // Act
      element.managing = true;

      // Assert
      expect(element.shadowRoot.addEventListener).toHaveBeenCalledTimes(1);
      expect(element.shadowRoot.addEventListener).toHaveBeenCalledWith(PROFILE_REQUEST_EVENT, jasmine.any(Function));
    });

    it('stops the propagation of profile request events from its shadow DOM', () => {
      // Arrange
      let childElement = document.createElement('div');
      childElement['prepareAdaptation'] = jasmine.createSpy('prepareAdaptation');
      childElement['performAdaptation'] = jasmine.createSpy('performAdaptation');
      element.appendChild(childElement);
      let event = new CustomEvent(PROFILE_REQUEST_EVENT, {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: { managedCallback: jasmine.createSpy('managedCallback'), requestor: childElement }
      });
      spyOn(event, 'stopImmediatePropagation');
      
      // Act
      childElement.dispatchEvent(event);

      // Assert
      expect(event.stopImmediatePropagation).toHaveBeenCalledTimes(1);
    });

    it('immediately adapts the requesting component to the current profile', () => {
      // Arrange
      let childElement = document.createElement(ELEMENT_NAME);
      spyOn(childElement, 'prepareAdaptation').and.callThrough();
      spyOn(childElement, 'performAdaptation').and.callThrough();
      
      // Act
      element.appendChild(childElement);

      // Assert
      expect(childElement.prepareAdaptation).toHaveBeenCalledTimes(2);
      expect(childElement.prepareAdaptation).toHaveBeenCalledWith(INITIAL_PROFILE);
      expect(childElement.performAdaptation).toHaveBeenCalledTimes(2);
      expect(childElement.performAdaptation).toHaveBeenCalledWith(INITIAL_PROFILE);
    });

    it('manages the adaptation of detected descendants on profile changes', () => {
      // Arrange
      const CHILD_COUNT = 3;
      let childElements = [];
      for (var i = 0; i < CHILD_COUNT; i++) {
        childElements[i] = document.createElement(ELEMENT_NAME);
        element.appendChild(childElements[i]);
        spyOn(childElements[i], 'prepareAdaptation').and.callThrough();
        spyOn(childElements[i], 'performAdaptation').and.callThrough();
      }
      const NEW_PROFILE = { foo: 'baz' };
      const PROFILE_CHANGES = { foo: { from: 'bar', to: 'baz' } };

      // Act
      container.dispatchEvent(new CustomEvent(PROFILE_CHANGED_EVENT, {detail: {current: NEW_PROFILE, changes: PROFILE_CHANGES}}));

      // Assert
      for (var i = 0; i < childElements.length; i++) {
        expect(childElements[i].prepareAdaptation).toHaveBeenCalledTimes(1);
        expect(childElements[i].prepareAdaptation).toHaveBeenCalledWith(NEW_PROFILE);
        expect(childElements[i].performAdaptation).toHaveBeenCalledTimes(1);
        expect(childElements[i].performAdaptation).toHaveBeenCalledWith(NEW_PROFILE);
      }
    });

    it('does not further manage components that have been removed from its shadow DOM', () => {
      // Arrange
      let childElement = document.createElement(ELEMENT_NAME);
      element.appendChild(childElement);
      spyOn(childElement, 'prepareAdaptation').and.callThrough();
      spyOn(childElement, 'performAdaptation').and.callThrough();
      const NEW_PROFILE = { foo: 'baz' };
      const PROFILE_CHANGES = { foo: { from: 'bar', to: 'baz' } };

      // Act
      element.removeChild(childElement);
      container.dispatchEvent(new CustomEvent(PROFILE_CHANGED_EVENT, {detail: {current: NEW_PROFILE, changes: PROFILE_CHANGES}}));

      // Assert
      expect(childElement.prepareAdaptation).not.toHaveBeenCalled();
      expect(childElement.performAdaptation).not.toHaveBeenCalled();
    });
  })
});

const DEFAULT_VARIANT_TYPE = class {
  constructor() {
    this._contentRoot = null;
  }

  set contentRoot(node) {
    this._contentRoot = node;
  }

  selectedCallback(state) {}
  deselectedCallback() { return {}; }

  connectedCallback() {
    this._contentRoot.appendChild(document.createElement('slot'));
  }

  disconnectedCallback() {}

  static matches(profile) {
    return true;
  }
};