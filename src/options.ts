import {
  isFunction,
  isBoolean,
  isNumber,
  isPlainObject,
  defaults,
  extend
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

const SCHEMA = {
  
  values: Object.getOwnPropertyNames(DEFAULTS),
  
  _chunkCheck(chunk) {
    if (!isNumber(chunk) || chunk <= 0) {
      throw new Error("'chunk' should be a positive number");
    }
  },
  
  _delayCheck(delay) {
    if (!isNumber(delay) || delay < 0) {
      throw new Error("'delay' should be a non-negative number");
    }
  },
  
  _scopeCheck(scope) {
    if (scope === undefined || isBoolean(scope) || isNumber(scope)) {
      throw new Error(
        "'scope' should be a defined non-boolean and non-number, or null")
    }
  },
  
  checkOption(key, value) {
    this[`_${key}Check`](value);
  }
  
};

let parseOptions = options => {
  let parsed = defaults({}, DEFAULTS);
    let setKey = (key, alias) => {
      if (options[alias] === undefined) {
        return false;
      }
      parsed[key] = options[alias];
      return true
    };
    for (let key of SCHEMA.values) {
      if (!setKey(key, key)) {
        for (let alias of ALIASES[key]) {
          if (setKey(key, alias)) {
            break
          }
        }
      }
      SCHEMA.checkOption(key, parsed[key]);
    }
    return parsed;
};
  

class ChunkifyOptions {
  
  constructor(options) {
    extend(this, parseOptions(options));
    Object.freeze(this);
  }

  static of(options) {
    if (options instanceof this) {
      return options;
    }
    let throwTypeError = () => {
      throw new TypeError(`Expected options object, got ${typeof options}`)
    };
    if (!isPlainObject(options)) {
      throwTypeError()
    } else if (Array.isArray(options)) {
      throwTypeError()
    } else if (isFunction(options)) {
      throwTypeError()
    }
    return new this(options)
  }

};

export default {
  of() {
    return ChunkifyOptions.of(...arguments)
  }
}