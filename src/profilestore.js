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
export default class ProfileStore {
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
    }});
    
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

/**
 * The type of the {@link CustomEvent} that is triggered when a profile has been changed.
 * @type {String}
 */
export const PROFILE_CHANGED_EVENT = 'awcProfileChanged';

/**
 * The type of {@link CustomEvent}s that represent a request to provide the current profile.
 */
export const PROFILE_REQUEST_EVENT = 'awcProfileRequest';

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