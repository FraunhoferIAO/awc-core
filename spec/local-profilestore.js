/*
 * Copyright (C) 2017 Fraunhofer IAO
 * All rights reserved.
 *
 * This software may be modified and distributed under the terms
 * of the Clear BSD license.  See the LICENSE file for details.
 */

import LocalProfileStore, {LOCAL_STORAGE_KEY} from 'local-profilestore.js';
import {PROFILE_REQUEST_EVENT} from 'profilestore.js';

describe('The Local Profile Store', () => {
  let store;
  
  beforeEach(() => {
    // Clean local storage
    window.localStorage.removeItem(LOCAL_STORAGE_KEY);

    // Create new LocalProfileStore
    store = new LocalProfileStore();
  });

  afterEach(() => {
    window.removeEventListener(PROFILE_REQUEST_EVENT, store._profileRequestHandler);
  });

  describe('initializes', () => {
    it('the local storage, if not set', () => {
      expect(window.localStorage.getItem(LOCAL_STORAGE_KEY)).toEqual('{}');
    });
    
    it('the returned profile', (done) => {
      let profile = store.profile;
      
      expect(profile).toEqual(jasmine.any(Promise));
      profile.then((val) => {
        expect(val).toEqual({});
        done();
      }, (err) => {
        done.fail(err);
      });
    });
    
    it('by reading the local storage, if existing', (done) => {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({foo: 'bar'}));
      
      window.removeEventListener(PROFILE_REQUEST_EVENT, store._profileRequestHandler);
      store = new LocalProfileStore();
      
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
  
  it('allows to change the profile', (done) => {
    expect(store.changeable).toEqual(true);

    let result = store.changeProfile({foo: 'baz'});
    expect(result).toEqual(jasmine.any(Promise));
    result.then((val) => {
      expect(val).toEqual({foo: {from: undefined, to: 'baz'}});
      done();
    }, (err) => {
      done.fail(err);
    });
  });

  it('stores changes in the local storage', (done) => {
    store.changeProfile({foo: 'baz'});

    let profile = store.profile;
    expect(profile).toEqual(jasmine.any(Promise));
    profile.then((val) => {
      expect(val).toEqual({foo: 'baz'});
      done();
    }, (err) => {
      done.fail(err);
    });

    expect(JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEY))).toEqual({foo: 'baz'});
  });
});