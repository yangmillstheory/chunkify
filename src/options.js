import {covenance, CovenantBroken} from 'covenance'
import frosty from 'frosty'
import _ from 'underscore'

const DEFAULTS = {
  chunk: 1,
  delay: 0
};

const SCHEMA = Object.getOwnPropertyNames(DEFAULTS);

class ChunkifyOptions {

  get covenance() {
    return covenance.of(
      {
        attribute: 'chunk',
        validator: (chunk) => {
          return _.isNumber(chunk) && chunk > 0;
        },
        excstring: "'chunk' should be a positive number"
      },
      {
        attribute: 'delay',
        validator: (delay) => {
          return _.isNumber(delay) && delay >= 0;
        },
        excstring: "'delay' should be a non-negative number"
      }
    )
  }

  constructor(options) {
    _.extend(this, this.constructor._parse_options(options));
    this.check_covenants();
    return this;
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