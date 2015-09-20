import {covenance, CovenantBroken} from 'covenance'
import _ from 'underscore'

const DEFAULTS = {
  chunk: 1,
  delay: 0,
  complete: function() {}
};

class ChunkifyOptions {

  get covenance() {
    return covenance.of(
      {attribute: 'chunk', validator: _.isNumber},
      {attribute: 'delay', validator: _.isNumber},
      {attribute: 'complete', validator: _.isFunction});
  }

  constructor(chunk, delay, complete) {
    _.extend(this, {chunk, delay, complete});
    try {
      this.check_covenants();
    } catch (e) {
      this.constructor._rethrow(e);
    }
    return this
  }

  static _rethrow(e) {
    if (e instanceof CovenantBroken) {
      throw new TypeError(`Expected ${e.attribute} to be ${typeof DEFAULTS[e.attribute]}`)
    }
    throw e
  }

  static of(options = {}) {
    new this(options.chunk, options.delay. options.complete)
  }
}

covenance.covenant(ChunkifyOptions, {
  pre_check_covenants() {
    for (let option in DEFAULTS) {
      if (this[option] === undefined) {
        this[option] = DEFAULTS[option];
      }
    }
  }
});

export default {
  of() {
    return ChunkifyOptions.of(...arguments)
  }
}