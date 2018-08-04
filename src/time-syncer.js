let instance = null;

/**
 * Is needed for time syncing with backend. It solves the problem when incorrect time on user's device lead to signature
 * expiration.
 */
export class TimeSyncer {
  /**
   * Constructs a new instance only in case it doesn't exist, otherwise returns previously created
   * @param {number} timestamp - valid timestamp preferred to use in signatures validUntil.
   * @return {TimeSyncer}
   */
  constructor(timestamp) {
    if (!instance) {
      this._diff = this._local() - timestamp;
      instance = this;
    }
    return instance;
  }

  /**
   * Returns valid timestamp synced with server time
   * @return {number}
   */
  now () {
    return this._local() - this._diff;
  }

  /**
   * Returns timestamp that is set in users device
   * @return {number}
   * @private
   */
  _local () {
    return new Date().getTime() / 1000;
  }
}
