import {covenance} from 'covenance'
import frosty from 'frosty'
import _ from 'underscore'

const DEFAULTS = {
  chunk: 1,
  delay: 0,
  scope: null
};

const ALIASES = {
  chunk: ['chunksize'],
  delay: [
    'yield',
    'yieldtime',
    'delaytime'
  ],
  scope: []
};

const SCHEMA = Object.getOwnPropertyNames(DEFAULTS);

let ChunkifyOptions = covenance.covenant(class {

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
      },
      {
        attribute: 'scope',
        validator: (scope) => {
          if (scope === undefined) {
            return false
          } else if (_.isBoolean(scope)) {
            return false
          } else if (_.isNumber(scope)) {
            return false
          }
          return true
        },
        excstring: "'scope' should be a defined non-boolean and non-number, or null"
      }
    )
  }

  constructor(options) {
    _.extend(this, this.constructor._parse_options(options));
    this.check_covenants();
    return this;
  }

  static _parse_options(options) {
    let parsed = {};
    let setkey = (key, alias) => {
      if (options[alias] === undefined) {
        return false;
      }
      parsed[key] = options[alias];
      return true
    };
    for (let key of SCHEMA) {
      if (!setkey(key, key)) {
        for (let alias of ALIASES[key]) {
          if (setkey(key, alias)) {
            break
          }
        }
      }
    }
    return _.defaults(parsed, DEFAULTS)
  }

  static of(options) {
    if (options instanceof this) {
      return options;
    }
    let throw_not_an_object = () => {
      throw new TypeError(`Expected options object, got ${typeof options}`)
    };
    if (!_.isObject(options)) {
      throw_not_an_object()
    } else if (Array.isArray(options)) {
      throw_not_an_object()
    } else if (_.isFunction(options)) {
      throw_not_an_object()
    }
    return new this(options)
  }

});

frosty.freeze(ChunkifyOptions.prototype, ...SCHEMA);

export default {
  of() {
    return ChunkifyOptions.of(...arguments)
  }
}