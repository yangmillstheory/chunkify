import {covenance} from 'covenance'
import frosty from 'frosty'
import {
  isFunction,
  isBoolean,
  isNumber,
  isObject,
  defaults
} from './utility'

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
          return isNumber(chunk) && chunk > 0;
        },
        excstring: "'chunk' should be a positive number"
      },
      {
        attribute: 'delay',
        validator: (delay) => {
          return isNumber(delay) && delay >= 0;
        },
        excstring: "'delay' should be a non-negative number"
      },
      {
        attribute: 'scope',
        validator: (scope) => {
          if (scope === undefined) {
            return false
          } else if (isBoolean(scope)) {
            return false
          } else if (isNumber(scope)) {
            return false
          }
          return true
        },
        excstring: "'scope' should be a defined non-boolean and non-number, or null"
      }
    )
  }

  constructor(options) {
    _.extend(this, this.constructor._parseOptions(options));
    this.check_covenants();
    return this;
  }

  static _parseOptions(options) {
    let parsed = defaults({}, DEFAULTS);
    let setKey = (key, alias) => {
      if (options[alias] === undefined) {
        return false;
      }
      parsed[key] = options[alias];
      return true
    };
    for (let key of SCHEMA) {
      if (!setKey(key, key)) {
        for (let alias of ALIASES[key]) {
          if (setKey(key, alias)) {
            break
          }
        }
      }
    }
    return parsed;
  }

  static of(options) {
    if (options instanceof this) {
      return options;
    }
    let throwTypeError = () => {
      throw new TypeError(`Expected options object, got ${typeof options}`)
    };
    if (!isObject(options)) {
      throwTypeError()
    } else if (Array.isArray(options)) {
      throwTypeError()
    } else if (isFunction(options)) {
      throwTypeError()
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