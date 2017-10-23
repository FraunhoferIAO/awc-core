/*
 * Copyright (C) 2017 Fraunhofer IAO
 * All rights reserved.
 *
 * This software may be modified and distributed under the terms
 * of the Clear BSD license.  See the LICENSE file for details.
 */

import AdaptiveVariant from 'adaptive-variant.js';

describe('The AdaptiveVariant', () => {
  it('returns a copy of its inner state on deselection', () =>{
    // Arrange
    class Variant extends AdaptiveVariant {
      get foo() {
        return 'bar';
      }

      get bar() {
        return {bar: 42, baz: 'foo'};
      }
    }
    let instance = new Variant();
    let fooSpy = spyOnProperty(instance, 'foo', 'get').and.callThrough();
    let barSpy = spyOnProperty(instance, 'bar', 'get').and.callThrough();

    // Act
    let state = instance.deselectedCallback();

    // Assert
    expect(fooSpy).toHaveBeenCalledTimes(1);
    expect(barSpy).toHaveBeenCalledTimes(1);
    expect(state).toEqual(jasmine.any(Object));
    expect(state.foo).toEqual('bar');
    expect(state.bar).toEqual({bar: 42, baz: 'foo'});
  });

  it('takes up the inner state given on selection', () => {
    // Arrange
    class Variant extends AdaptiveVariant {
      set foo(val) { }

      set bar(val) { }
    }
    let instance = new Variant();
    let fooSpy = spyOnProperty(instance, 'foo', 'set');
    let barSpy = spyOnProperty(instance, 'bar', 'set');

    // Act
    instance.selectedCallback({foo: 'bar', bar: {bar: 42, baz: 'foo'}});

    // Assert
    expect(fooSpy).toHaveBeenCalledTimes(1);
    expect(fooSpy.calls.mostRecent().args[0]).toEqual('bar');
    expect(barSpy).toHaveBeenCalledTimes(1);
    expect(barSpy.calls.mostRecent().args[0]).toEqual({bar: 42, baz: 'foo'});
  })
});