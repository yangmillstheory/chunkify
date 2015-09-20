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
    _.extend(this, _.defaults({chunk, delay, complete}, DEFAULTS));
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

  static of(options) {
    if (!options) {
      throw new TypeError(`Expected options object, got ${typeof options}`)
    }
    return new this(options)
  }

}

covenance.covenant(ChunkifyOptions);

export default {
  of() {
    return ChunkifyOptions.of(...arguments)
  }
}