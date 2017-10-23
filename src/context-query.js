/*
 * Copyright (C) 2017 Fraunhofer IAO
 * All rights reserved.
 *
 * This software may be modified and distributed under the terms
 * of the Clear BSD license.  See the LICENSE file for details.
 */

import {PROFILE_CHANGED_EVENT, PROFILE_REQUEST_EVENT} from 'profilestore.js';

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
export default class ContextQuery {
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
    this._profileChangeHandler = (event) => {
      let profile = event.detail.current
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
    if (type == 'change' && listener == this._onchangeListener) { return; }

    if ((type in this._listeners) && this._listeners[type].indexOf(listener) > -1) {
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
  prepareAdaptation(profile) {

  }

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
        managedCallback: (manager) => {
        }
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

// Patch factory function into window object
window.matchContext = function(expression) {           
  return new ContextQuery(expression, window);
}

/**   
 * @param {String} query
 * @private
 */
function breakQueriesDown(query) {
  let arrayOfContexts = [], or = /\s*,\s*|\s*or\s*/i, orArr = query.split(or), lt = '<', gt = '>', lteq = '<=', gteq = '>=';
  for (let y of orArr) {
    let contextRuleObj = { contexts: [] }, arrOfObj = [];
    let andArr = y.split(/\s*and\s*/i);
    for (let j of andArr) {
      let sr = j.substring(j.indexOf("(") + 1, j.indexOf(")")), ra, prcnt = '%', obj = {}, objName, incdec;
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
    let left = false, tmpArr, tmpStr;
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
      let min = Number.NEGATIVE_INFINITY, max = Number.POSITIVE_INFINITY;
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
