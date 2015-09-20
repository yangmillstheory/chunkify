import {covenance, CovenantBroken} from 'covenance'
import frosty from 'frosty'
import _ from 'underscore'

const DEFAULTS = {
  chunk: 1,
  delay: 0,
  complete: function() {} // no-op pass-through
};

const SCHEMA = Object.getOwnPropertyNames(DEFAULTS);

class ChunkifyOptions {

  get covenance() {
    return covenance.of(
      {attribute: 'chunk', validator: _.isNumber},
      {attribute: 'delay', validator: _.isNumber},
      {attribute: 'complete', validator: _.isFunction});
  }

  constructor(options) {
    _.extend(this, this.constructor._parse_options(options));
    try {
      this.check_covenants();
    } catch (e) {
      // adapt exception to be more informative
      if (e instanceof CovenantBroken) {
        let attribute = e.attribute;
        let expected = typeof DEFAULTS[attribute];
        let received = typeof options[attribute];
        throw new TypeError(
          `Expected '${attribute}' to be '${expected}', got '${received}'`)
      }
      throw e
    }
    return this
  }

  static _parse_options(options) {
    return _.defaults(_.pick(options, ...SCHEMA), DEFAULTS)
  }

  static of(options) {
    let throw_error = () => {
      throw new TypeError(`Expected options object, got ${typeof options}`)
    };
    if (!_.isObject(options)) {
      throw_error()
    } else if (Array.isArray(options)) {
      throw_error()
    } else if (_.isFunction(options)) {
      throw_error()
    }
    return new this(options)
  }

}

frosty.freeze(ChunkifyOptions.prototype, ...SCHEMA);
covenance.covenant(ChunkifyOptions);

export default {
  of() {
    return ChunkifyOptions.of(...arguments)
  }
}