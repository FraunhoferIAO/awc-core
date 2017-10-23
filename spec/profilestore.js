/*
 * Copyright (C) 2017 Fraunhofer IAO
 * All rights reserved.
 *
 * This software may be modified and distributed under the terms
 * of the Clear BSD license.  See the LICENSE file for details.
 */

import ProfileStore, {PROFILE_CHANGED_EVENT, PROFILE_REQUEST_EVENT} from 'profilestore.js';

describe('The Profile Store', () => {
  let store;
  
  beforeEach(() => {
    // Create new ProfileStore
    store = new ProfileStore(true);
  });

  afterEach(() => {
    window.removeEventListener(PROFILE_REQUEST_EVENT, store._profileRequestHandler);
  });

  describe('provides a profile', () => {
    it('by means of a promise', () => {
      // Arrange
      // Act
      // Assert
      expect(store.profile).toEqual(jasmine.any(Promise));
    });

    it('that is initialized empty', (done) => {
      // Arrange
      // Act   
      let profile = store.profile;

      // Assert
      expect(profile).toEqual(jasmine.any(Promise));
      profile.then((val) => {
        expect(val).toEqual({});
        done();
      }, (err) => {
        done.fail(err);
      });
    });

    it('that is copy of the internally stored profile', (done) => {
      // Arrange
      store._profile = {foo: 'bar'};

      // Act
      let profile = store.profile;

      // Assert
      expect(profile).toEqual(jasmine.any(Promise));
      profile.then((val) => {
        expect(val).toEqual(store._profile);
        expect(val).not.toBe(store._profile);
        done();
      }, (err) => {
        done.fail(err);
      });
    });

    it('that can not be reassigned', (done) => {
      // Arrange
      store._profile = {foo: 'bar'};

      // Act
      let illegalAction = () => {
        store.profile = {};
      };

      // Assert
      expect(illegalAction).toThrow();
      let profile = store.profile;
      expect(profile).toEqual(jasmine.any(Promise));
      profile.then((val) => {
        expect(val).toEqual({foo: 'bar'});
        done();
      }, (err) => {
        done.fail(err);
      });
    });
  });

  describe('allows to change the profile', () => {
    beforeEach(() => {
      store._profile = {foo: 'bar'};
    });

    it('if told so on construction', () => {
      // Arrange
      // Act
      // Assert
      expect(store.changeable).toEqual(true);
    });

    it('but not by default', () => {
      // Arrange
      // Act
      let defaultedStore = new ProfileStore();

      // Assert
      expect(defaultedStore.changeable).toEqual(false);

      // Clean up
      window.removeEventListener(PROFILE_REQUEST_EVENT, defaultedStore._profileRequestHandler);
    });
    
    it('by setting a new variable', (done) => {
      // Arrange
      // Act
      let result = store.changeProfile({bar: 'baz'});
      
      // Assert
      expect(result).toEqual(jasmine.any(Promise));
      result.then((val) => {
        expect(val).toEqual({bar: {from: undefined, to: 'baz'}});
        done();
      }, (err) => {
        done.fail(err);
      });
      let profile = store.profile;
      expect(profile).toEqual(jasmine.any(Promise));
      profile.then((val) => {
        expect(val).toEqual({foo: 'bar',  bar: 'baz'});
        done();
      }, (err) => {
        done.fail(err);
      });
    });
    
    it('by modifying the value of an existing variable', (done) => {
      // Arrange
      // Act
      let result = store.changeProfile({foo: 'baz'});
      
      // Assert
      expect(result).toEqual(jasmine.any(Promise));
      result.then((val) => {
        expect(val).toEqual({foo: {from: 'bar', to: 'baz'}});
        done();
      }, (err) => {
        done.fail(err);
      });
      let profile = store.profile;
      expect(profile).toEqual(jasmine.any(Promise));
      profile.then((val) => {
        expect(val).toEqual({foo: 'baz'});
        done();
      }, (err) => {
        done.fail(err);
      });
    });
    
    it('by undefining an existing variable', (done) => {
      // Arrange
      // Act
      let result = store.changeProfile({foo: undefined});
      
      // Assert
      expect(result).toEqual(jasmine.any(Promise));
      result.then((val) => {
        expect(val).toEqual({foo: {from: 'bar', to: undefined}});
        done();
      }, (err) => {
        done.fail(err);
      });
      let profile = store.profile;
      expect(profile).toEqual(jasmine.any(Promise));
      profile.then((val) => {
        expect(val).toEqual({});
        done();
      }, (err) => {
        done.fail(err);
      });
    });

    it('but not by modifying a returned profile', (done) => {
      // Arrange
      store.profile.then((val) => {

        // Act
        val['bar'] = 'baz';
        store.profile.then((newval) => {

          // Assert
          expect(newval).toEqual({foo: 'bar'});
          done();
        }, (err) => {
          done.fail(err);
        });
      }, (err) => {
        done.fail(err);
      });
    });

    it('but only if explicitly supported', (done) => {
      // Arrange
      window.removeEventListener(PROFILE_REQUEST_EVENT, store._profileRequestHandler);
      store = new ProfileStore();

      // Act
      let result = store.changeProfile({foo: 'baz'})
      
      // Assert
      expect(result).toEqual(jasmine.any(Promise));
      result.then((val) => {
        done.fail('Promise should reject, but resolved to: ' + val);
      }, (err) => {
        done();
      });
    });
  });

  describe('triggers an profile changed event', () => {
    beforeEach(() => {
      store._profile = {changed: 'old', gone: 'value'};
      spyOn(window, 'dispatchEvent');
    });

    it('to the window object by default', () => {
      // Arrange
      // Act
      store.changeProfile({foo: 'bar'});

      // Assert
      expect(window.dispatchEvent).toHaveBeenCalledTimes(1);
    });

    it('to the specified event node', () => {
      // Arrange
      let eventNode = {
        dispatchEvent: jasmine.createSpy('dispatchEvent'),
        addEventListener: jasmine.createSpy('addEventListener'),
        removeEventListener: jasmine.createSpy('removeEventListener')
      };
      let attachedStore = new ProfileStore(true, eventNode);
      attachedStore._profile = {changed: 'old', gone: 'value'};

      // Act
      attachedStore.changeProfile({foo: 'bar'});

      // Assert
      expect(eventNode.dispatchEvent).toHaveBeenCalledTimes(1);
    });

    it('of the defined type', () => {
      // Arrange
      // Act
      store.changeProfile({foo: 'bar'});

      // Assert
      expect(window.dispatchEvent).toHaveBeenCalledTimes(1);
      expect(window.dispatchEvent.calls.mostRecent().args[0].type).toEqual(PROFILE_CHANGED_EVENT);
    });

    it('referring to the profile store it originated from', () => {
      // Arrange
      // Act
      store.changeProfile({foo: 'bar'});

      // Assert
      expect(window.dispatchEvent).toHaveBeenCalledTimes(1);
      expect(window.dispatchEvent.calls.mostRecent().args[0].detail.store).toBe(store);
    });

    it('containing the changed profile', () => {
      // Arrange
      // Act
      store.changeProfile({changed: 'new', gone: undefined, new: 'value'});

      // Assert
      expect(window.dispatchEvent).toHaveBeenCalledTimes(1);
      expect(window.dispatchEvent.calls.mostRecent().args[0].detail.current).toEqual({
        changed: 'new',
        new: 'value'
      });
    });

    it('containing the diff for the changed variables', () => {
      // Arrange
      // Act
      store.changeProfile({changed: 'new', gone: undefined, new: 'value'});

      // Assert
      expect(window.dispatchEvent).toHaveBeenCalledTimes(1);
      expect(window.dispatchEvent.calls.mostRecent().args[0].detail.changes).toEqual({
        changed: {from: 'old', to: 'new'},
        gone: {from: 'value', to: undefined},
        new: {from: undefined, to: 'value'}
      });
    });

    it('but not if no change is requested', () => {
      // Arrange
      // Act
      store.changeProfile(undefined);

      // Assert
      expect(window.dispatchEvent).not.toHaveBeenCalled();
    });

    it('but not if change request is empty', () => {
      // Arrange
      // Act
      store.changeProfile({});

      // Assert
      expect(window.dispatchEvent).not.toHaveBeenCalled();
    });

    it('but not if change request equals current value', () => {
      // Arrange
      // Act
      store.changeProfile({changed: 'old'});

      // Assert
      expect(window.dispatchEvent).not.toHaveBeenCalled();
    });
  });

  describe('listens to profile request events', () => {
    it('on the specified event node', () => {
      // Arrange
      let eventNode = {
        dispatchEvent: jasmine.createSpy('dispatchEvent'),
        addEventListener: jasmine.createSpy('addEventListener'),
        removeEventListener: jasmine.createSpy('removeEventListener')
      };

      // Act
      let attachedStore = new ProfileStore(true, eventNode);

      // Assert
      expect(eventNode.addEventListener).toHaveBeenCalledTimes(1);
      expect(eventNode.addEventListener).toHaveBeenCalledWith(PROFILE_REQUEST_EVENT, jasmine.any(Function));
    });

    it('stops the propagation of profile request events it handles', () => {
      // Arrange
      let eventNode = {
        dispatchEvent: jasmine.createSpy('dispatchEvent'),
        addEventListener: jasmine.createSpy('addEventListener'),
        removeEventListener: jasmine.createSpy('removeEventListener')
      };
      let attachedStore = new ProfileStore(true, eventNode);
      let handler = eventNode.addEventListener.calls.mostRecent().args[1];
      let event = new CustomEvent(PROFILE_REQUEST_EVENT, {cancelable: true, detail: {callback: (...args) => {}}});
      spyOn(event, 'stopImmediatePropagation');
      
      // Act
      handler(event);

      // Assert
      expect(event.stopImmediatePropagation).toHaveBeenCalledTimes(1);
    });
  });
});