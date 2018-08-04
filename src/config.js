import clone from 'lodash/clone';

let defaultConfig = {
  allowHttp: false,
  serverURLPrefix: []
};

let config = clone(defaultConfig);

/**
 * Global config class.
 *
 * Usage node:
 * ```
 * import {Config} from 'stellar-sdk';
 * Config.setAllowHttp(true);
 * ```
 *
 * Usage browser:
 * ```
 * StellarSdk.Config.setAllowHttp(true);
 * ```
 * @static
 */
class Config {
  /**
   * Sets `allowHttp` flag globally. When set to `true`, connections to insecure http protocol servers will be allowed.
   * Must be set to `false` in production. Default: `false`.
   * @param {boolean} value
   * @static
   */
  static setAllowHttp(value) {
    config.allowHttp = value;
  }

  /**
   * Returns the value of `allowHttp` flag.
   * @static
   */
  static isAllowHttp() {
    return clone(config.allowHttp);
  }

  /**
   * Sets all global config flags to default values.
   * @static
   */
  static setDefault() {
    config = clone(defaultConfig);
  }

  /**
   * Sets `serverURLPrefix` globally. When set StellarSdk.CallBuilder will add this prefix
   * for each request to Horizon. Example:
   * `http://horizon.io/some/path` -> `http://horizon.io/my/pref/some/path`
   * @param {string} value - for example `/my/pref`
   * @static
   */
  static setURLPrefix(value) {
    config.serverURLPrefix = value.split('/').filter(s => s !=='');
  }

  /**
   * Returns the value of `serverURLPrefix`.
   * @static
   */
  static getURLPrefix() {
    return config.serverURLPrefix;
  }

  /**
   * Returns the value of `serverURLPrefix`.
   * @param {string} value - for example `/my/pref`
   * @static
   */
  static getURLPrefixedPath(value) {
    let path = value.split('/').filter(s => s !=='');
    return config.serverURLPrefix.concat(
      path.filter(item => config.serverURLPrefix.indexOf(item) < 0)
    );
  }

  /**
   * Returns the true if `serverURLPrefix` not empty.
   * @static
   */
  static isURLPrefix() {
    return config.serverURLPrefix.length > 0;
  }
}

export {Config};
