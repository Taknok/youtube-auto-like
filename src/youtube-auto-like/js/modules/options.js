/*
 * Wrapper around the storage API for easy storing/retrieving of option data
 * Handles defaults based on a configuration object initially provided
 * Stores data under (surprise!) the key 'options'
 */

var DEFAULT_OPTIONS = {
  like_what: 'subscribed',
  like_timer: 'instant',
  minute_timer: false,
  minute_value: 10,
  percentage_timer: true,
  percentage_value: 5,
  use_list: false,
  type_list: 'black',
  plugin_version: "0.0.0",
  creator_list: [],
  debug: false,
  debug_displayed: false,
  counter: 0,
}

export class OptionManager {
  /**
   * @param  {Object} defaults Figure it out
   */
  constructor(defaults = null) {
    this.defaults = defaults === null ? DEFAULT_OPTIONS : defaults;
  }

  /**
   * Retrieve all options
   * @return {Promise} Contains options object on resolve
   */
  get() {
    return browser.storage.local.get(this.defaults);
  }

  /*
   * Set options
   * @param {Object} options Key-value pairs of options to set
   * @return {Promise} Will resolve when successful
   */
  set(options) {
    return browser.storage.local.set(options);
  }
}