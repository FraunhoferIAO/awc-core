/*
 * Copyright (C) 2017 Fraunhofer IAO
 * All rights reserved.
 *
 * This software may be modified and distributed under the terms
 * of the Clear BSD license.  See the LICENSE file for details.
 */

import ProfileStore from 'profilestore.js';

/**
 * A {@link ProfileStore} implementation based on {@link https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage HTML5 Local Storage}.
 * 
 * @param {EventTarget} [attachTo=window] - Specifies the node this ProfileStore is attached to and dispatches its events to.
 */
export default class LocalProfileStore extends ProfileStore {
  constructor(attachTo = window) {
    super(true, attachTo);

    if (typeof(window.localStorage) !== 'undefined') {
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
        if(newValue !== undefined) {
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

/**
 * The storage key used for storing the profile.
 * @type {String}
 */
export const LOCAL_STORAGE_KEY = 'awcLocalProfileStore';