/*
 * Copyright (C) 2017 Fraunhofer IAO
 * All rights reserved.
 *
 * This software may be modified and distributed under the terms
 * of the Clear BSD license.  See the LICENSE file for details.
 */

import ContextQuery from 'context-query.js';
import {PROFILE_CHANGED_EVENT, PROFILE_REQUEST_EVENT} from 'profilestore.js';

describe('The ContextQuery', () => {
  it('dispatches a bubbling profile request event to the attached EventTarget', () => {
    // Arrange
    let attachPoint = document.createElement('div');
    let eventSpy = jasmine.createSpy('EventHandler');
    attachPoint.addEventListener(PROFILE_REQUEST_EVENT, eventSpy);

    // Act
    let q = new ContextQuery('(foo)', attachPoint);

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
    attachPoint.removeEventListener(PROFILE_REQUEST_EVENT, eventSpy);
  });

  it('listens to profile changed events on the detected profile source', () => {
    // Arrange
    let attachPoint = document.createElement('div');
    let eventSpy = jasmine.createSpy('EventHandler');
    attachPoint.addEventListener(PROFILE_REQUEST_EVENT, eventSpy);
    let q = new ContextQuery('(foo)', attachPoint);
    let callback = eventSpy.calls.mostRecent().args[0].detail.callback;
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

  describe('evaluates query expressions against the current context', () => {
    let attachPoint;

    beforeEach(() => {
      attachPoint = document.createElement('div');
    });
    
    it('empty query', () => {
      // Arrange
      let q = new ContextQuery('', attachPoint);

      // Act
      q.performAdaptation({foo: true});

      // Assert
      expect(q.matches).toBeTruthy();

      // Act
      q.performAdaptation({foo: false});

      // Assert
      expect(q.matches).toBeTruthy();
    });

    it('boolean feature', () => {
      // Arrange
      let q = new ContextQuery('(foo)', attachPoint);

      // Act
      q.performAdaptation({foo: true});

      // Assert
      expect(q.matches).toBeTruthy();

      // Act
      q.performAdaptation({foo: false});

      // Assert
      expect(q.matches).toBeFalsy();
    });

    it('numeric feature absolute value', () => {
      // Arrange
      let q = new ContextQuery('(foo: 42)', attachPoint);

      // Act
      q.performAdaptation({foo: 42});

      // Assert
      expect(q.matches).toBeTruthy('equal');

      // Act
      q.performAdaptation({foo: 41});

      // Assert
      expect(q.matches).toBeFalsy('less');

      // Act
      q.performAdaptation({foo: 43});

      // Assert
      expect(q.matches).toBeFalsy('greater');
    });

    it('numeric feature mininum value', () => {
      // Arrange
      let q = new ContextQuery('(min-foo: 42)', attachPoint);

      // Act
      q.performAdaptation({foo: 42});

      // Assert
      expect(q.matches).toBeTruthy('equal');

      // Act
      q.performAdaptation({foo: 41});

      // Assert
      expect(q.matches).toBeFalsy('less');

      // Act
      q.performAdaptation({foo: 43});

      // Assert
      expect(q.matches).toBeTruthy('greater');
    });

    it('numeric feature maximum value', () => {
      // Arrange
      let q = new ContextQuery('(max-foo: 42)', attachPoint);

      // Act
      q.performAdaptation({foo: 42});

      // Assert
      expect(q.matches).toBeTruthy('equal');

      // Act
      q.performAdaptation({foo: 41});

      // Assert
      expect(q.matches).toBeTruthy('less');

      // Act
      q.performAdaptation({foo: 43});

      // Assert
      expect(q.matches).toBeFalsy('greater');
    });

    it('numeric feature greater than value', () => {
      // Arrange
      let q = new ContextQuery('(foo > 42)', attachPoint);

      // Act
      q.performAdaptation({foo: 42});

      // Assert
      expect(q.matches).toBeFalsy('equal');

      // Act
      q.performAdaptation({foo: 41});

      // Assert
      expect(q.matches).toBeFalsy('less');

      // Act
      q.performAdaptation({foo: 43});

      // Assert
      expect(q.matches).toBeTruthy('greater');
    });

    it('numeric feature less than value', () => {
      // Arrange
      let q = new ContextQuery('(foo < 42)', attachPoint);

      // Act
      q.performAdaptation({foo: 42});

      // Assert
      expect(q.matches).toBeFalsy('equal');

      // Act
      q.performAdaptation({foo: 41});

      // Assert
      expect(q.matches).toBeTruthy('less');

      // Act
      q.performAdaptation({foo: 43});

      // Assert
      expect(q.matches).toBeFalsy('greater');
    });

    it('numeric feature greater than or equal value', () => {
      // Arrange
      let q = new ContextQuery('(foo >= 42)', attachPoint);

      // Act
      q.performAdaptation({foo: 42});

      // Assert
      expect(q.matches).toBeTruthy('equal');

      // Act
      q.performAdaptation({foo: 41});

      // Assert
      expect(q.matches).toBeFalsy('less');

      // Act
      q.performAdaptation({foo: 43});

      // Assert
      expect(q.matches).toBeTruthy('greater');
    });

    it('numeric feature less than or equal value', () => {
      // Arrange
      let q = new ContextQuery('(foo <= 42)', attachPoint);

      // Act
      q.performAdaptation({foo: 42});

      // Assert
      expect(q.matches).toBeTruthy();

      // Act
      q.performAdaptation({foo: 41});

      // Assert
      expect(q.matches).toBeTruthy();

      // Act
      q.performAdaptation({foo: 43});

      // Assert
      expect(q.matches).toBeFalsy();
    });

    it('numeric feature less than range', () => {
      // Arrange
      let q = new ContextQuery('(41 < foo < 43)', attachPoint);

      // Act
      q.performAdaptation({foo: 42});

      // Assert
      expect(q.matches).toBeTruthy('inner');

      // Act
      q.performAdaptation({foo: 40});

      // Assert
      expect(q.matches).toBeFalsy('less');

      // Act
      q.performAdaptation({foo: 44});

      // Assert
      expect(q.matches).toBeFalsy('greater');

      // Act
      q.performAdaptation({foo: 41});

      // Assert
      expect(q.matches).toBeFalsy('lower');

      // Act
      q.performAdaptation({foo: 43});

      // Assert
      expect(q.matches).toBeFalsy('upper');
    });

    it('numeric feature greater than range', () => {
      // Arrange
      let q = new ContextQuery('(43 > foo > 41)', attachPoint);

      // Act
      q.performAdaptation({foo: 42});

      // Assert
      expect(q.matches).toBeTruthy('inner');

      // Act
      q.performAdaptation({foo: 40});

      // Assert
      expect(q.matches).toBeFalsy('less');

      // Act
      q.performAdaptation({foo: 44});

      // Assert
      expect(q.matches).toBeFalsy('greater');

      // Act
      q.performAdaptation({foo: 41});

      // Assert
      expect(q.matches).toBeFalsy('lower');

      // Act
      q.performAdaptation({foo: 43});

      // Assert
      expect(q.matches).toBeFalsy('upper');
    });

    it('numeric feature less than or equal range', () => {
      // Arrange
      let q = new ContextQuery('(41 <= foo <= 43)', attachPoint);

      // Act
      q.performAdaptation({foo: 42});

      // Assert
      expect(q.matches).toBeTruthy('inner');

      // Act
      q.performAdaptation({foo: 40});

      // Assert
      expect(q.matches).toBeFalsy('less');

      // Act
      q.performAdaptation({foo: 44});

      // Assert
      expect(q.matches).toBeFalsy('greater');

      // Act
      q.performAdaptation({foo: 41});

      // Assert
      expect(q.matches).toBeTruthy('lower');

      // Act
      q.performAdaptation({foo: 43});

      // Assert
      expect(q.matches).toBeTruthy('upper');
    });

    it('numeric feature greater than or equal range', () => {
      // Arrange
      let q = new ContextQuery('(43 >= foo >= 41)', attachPoint);

      // Act
      q.performAdaptation({foo: 42});

      // Assert
      expect(q.matches).toBeTruthy('inner');

      // Act
      q.performAdaptation({foo: 40});

      // Assert
      expect(q.matches).toBeFalsy('less');

      // Act
      q.performAdaptation({foo: 44});

      // Assert
      expect(q.matches).toBeFalsy('greater');

      // Act
      q.performAdaptation({foo: 41});

      // Assert
      expect(q.matches).toBeTruthy('lower');

      // Act
      q.performAdaptation({foo: 43});

      // Assert
      expect(q.matches).toBeTruthy('upper');
    });

    it('numeric feature less than or equal upper range', () => {
      // Arrange
      let q = new ContextQuery('(41 < foo <= 43)', attachPoint);

      // Act
      q.performAdaptation({foo: 42});

      // Assert
      expect(q.matches).toBeTruthy('inner');

      // Act
      q.performAdaptation({foo: 40});

      // Assert
      expect(q.matches).toBeFalsy('less');

      // Act
      q.performAdaptation({foo: 44});

      // Assert
      expect(q.matches).toBeFalsy('greater');

      // Act
      q.performAdaptation({foo: 41});

      // Assert
      expect(q.matches).toBeFalsy('lower');

      // Act
      q.performAdaptation({foo: 43});

      // Assert
      expect(q.matches).toBeTruthy('upper');
    });

    it('numeric feature greater than or equal upper range', () => {
      // Arrange
      let q = new ContextQuery('(43 >= foo > 41)', attachPoint);

      // Act
      q.performAdaptation({foo: 42});

      // Assert
      expect(q.matches).toBeTruthy('inner');

      // Act
      q.performAdaptation({foo: 40});

      // Assert
      expect(q.matches).toBeFalsy('less');

      // Act
      q.performAdaptation({foo: 44});

      // Assert
      expect(q.matches).toBeFalsy('greater');

      // Act
      q.performAdaptation({foo: 41});

      // Assert
      expect(q.matches).toBeFalsy('lower');

      // Act
      q.performAdaptation({foo: 43});

      // Assert
      expect(q.matches).toBeTruthy('upper');
    });

    it('numeric feature less than or equal lower range', () => {
      // Arrange
      let q = new ContextQuery('(41 <= foo < 43)', attachPoint);

      // Act
      q.performAdaptation({foo: 42});

      // Assert
      expect(q.matches).toBeTruthy('inner');

      // Act
      q.performAdaptation({foo: 40});

      // Assert
      expect(q.matches).toBeFalsy('less');

      // Act
      q.performAdaptation({foo: 44});

      // Assert
      expect(q.matches).toBeFalsy('greater');

      // Act
      q.performAdaptation({foo: 41});

      // Assert
      expect(q.matches).toBeTruthy('lower');

      // Act
      q.performAdaptation({foo: 43});

      // Assert
      expect(q.matches).toBeFalsy('upper');
    });

    it('numeric feature greater than or equal lower range', () => {
      // Arrange
      let q = new ContextQuery('(43 > foo >= 41)', attachPoint);

      // Act
      q.performAdaptation({foo: 42});

      // Assert
      expect(q.matches).toBeTruthy('inner');

      // Act
      q.performAdaptation({foo: 40});

      // Assert
      expect(q.matches).toBeFalsy('less');

      // Act
      q.performAdaptation({foo: 44});

      // Assert
      expect(q.matches).toBeFalsy('greater');

      // Act
      q.performAdaptation({foo: 41});

      // Assert
      expect(q.matches).toBeTruthy('lower');

      // Act
      q.performAdaptation({foo: 43});

      // Assert
      expect(q.matches).toBeFalsy('upper');
    });

    it('numeric feature negative range', () => {
      // Arrange
      let q = new ContextQuery('(41 > foo > 43)', attachPoint);

      // Act
      q.performAdaptation({foo: 42});

      // Assert
      expect(q.matches).toBeFalsy('inner');

      // Act
      q.performAdaptation({foo: 40});

      // Assert
      expect(q.matches).toBeFalsy('less');

      // Act
      q.performAdaptation({foo: 44});

      // Assert
      expect(q.matches).toBeFalsy('greater');

      // Act
      q.performAdaptation({foo: 41});

      // Assert
      expect(q.matches).toBeFalsy('lower');

      // Act
      q.performAdaptation({foo: 43});

      // Assert
      expect(q.matches).toBeFalsy('upper');
    });

    it('numeric feature range conjunction', () => {
      // Arrange
      let q = new ContextQuery('(40 < foo <= 42) and (42 <= foo < 44)', attachPoint);

      // Act
      q.performAdaptation({foo: 42});

      // Assert
      expect(q.matches).toBeTruthy('overlap');

      // Act
      q.performAdaptation({foo: 39});

      // Assert
      expect(q.matches).toBeFalsy('less');

      // Act
      q.performAdaptation({foo: 45});

      // Assert
      expect(q.matches).toBeFalsy('greater');

      // Act
      q.performAdaptation({foo: 40});

      // Assert
      expect(q.matches).toBeFalsy('lower');

      // Act
      q.performAdaptation({foo: 44});

      // Assert
      expect(q.matches).toBeFalsy('upper');

      // Act
      q.performAdaptation({foo: 41});

      // Assert
      expect(q.matches).toBeFalsy('first inner');

      // Act
      q.performAdaptation({foo: 43});

      // Assert
      expect(q.matches).toBeFalsy('second inner');
    });

    it('numeric feature range disjunction', () => {
      // Arrange
      let q = new ContextQuery('(40 < foo < 42) or (42 < foo < 44)', attachPoint);

      // Act
      q.performAdaptation({foo: 42});

      // Assert
      expect(q.matches).toBeFalsy('overlap');

      // Act
      q.performAdaptation({foo: 39});

      // Assert
      expect(q.matches).toBeFalsy('less');

      // Act
      q.performAdaptation({foo: 45});

      // Assert
      expect(q.matches).toBeFalsy('greater');

      // Act
      q.performAdaptation({foo: 40});

      // Assert
      expect(q.matches).toBeFalsy('lower');

      // Act
      q.performAdaptation({foo: 44});

      // Assert
      expect(q.matches).toBeFalsy('upper');

      // Act
      q.performAdaptation({foo: 41});

      // Assert
      expect(q.matches).toBeTruthy('first inner');

      // Act
      q.performAdaptation({foo: 43});

      // Assert
      expect(q.matches).toBeTruthy('second inner');
    });
  });

  describe('handles change events', () => {
    let query, listener1, listener2, event;

    beforeEach(() => {
      query = new ContextQuery('', document.createElement('div'));
      listener1 = jasmine.createSpy('Listener 1');
      listener2 = jasmine.createSpy('Listener 2');
      event = new CustomEvent('change');
    });

    it('notifies all listeners that have been added for the event type', () => {
      // Arrange
      query.addEventListener('change', listener1);
      query.addEventListener('change', listener2);

      // Act
      query.dispatchEvent(event);

      // Assert
      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledTimes(1);
      expect(listener1).toHaveBeenCalledWith(event);
      expect(listener2).toHaveBeenCalledWith(event);
    });

    it('does not notify listeners that have been added for another event type', () => {
      // Arrange
      query.addEventListener('change', listener1);
      query.addEventListener('foobar', listener2);

      // Act
      query.dispatchEvent(event);

      // Assert
      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener1).toHaveBeenCalledWith(event);
      expect(listener2).not.toHaveBeenCalled();
    });

    it('does not notify the same listener twice', () => {
      // Arrange
      query.addEventListener('change', listener1);
      query.addEventListener('change', listener1);

      // Act
      query.dispatchEvent(event);

      // Assert
      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener1).toHaveBeenCalledWith(event);
    });

    it('does not notify removed listeners', () => {
      // Arrange
      query.addEventListener('change', listener1);
      query.addEventListener('change', listener2);
      query.removeEventListener('change', listener1);

      // Act
      query.dispatchEvent(event);

      // Assert
      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledWith(event);
    });

    it('knows its current "onchange" listener', () => {
      // Arrange
      query.onchange = listener1;

      // Act
      // Assert
      expect(query.onchange).toEqual(listener1);
    });

    it('notifies only its current "onchange" listener', () => {
      // Arrange
      query.onchange = listener1;
      query.onchange = listener2;

      // Act
      query.dispatchEvent(event);

      // Assert
      expect(listener1).not.toHaveBeenCalled;
      expect(listener2).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledWith(event);
    });

    it('does not remove its "onchange" listener', () => {
      // Arrange
      query.onchange = listener1;
      query.removeEventListener('change', listener1);
      
      // Act
      query.dispatchEvent(event);

      // Assert
      expect(query.onchange).toEqual(listener1);
      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener1).toHaveBeenCalledWith(event);
    });

    it('does not notify any listener of "onchange" has been set "null"', () => {
      // Arrange
      query.onchange = listener1;
      query.onchange = null;

      // Act
      query.dispatchEvent(event);

      // Assert
      expect(listener1).not.toHaveBeenCalled;
    });
  });
});