import {
  isFunction,
  isBoolean,
  isNumber,
  isPlainObject,
  extend,
  forOwn,
} from './utility';


export const DEFAULT_OPTIONS: IChunkifyOptions = Object.freeze({
  chunk: 10,
  delay: 50,
  scope: null,
});

// interface representing a possible
// option key and its various aliases
interface IOptionKey {
  primary: string;
  aliases: string[];
}

const CHUNK: IOptionKey = {primary: 'chunk', aliases: ['chunksize']};
const SCOPE: IOptionKey = {primary: 'scope', aliases: []};
const DELAY: IOptionKey = {primary: 'delay', aliases:
  [
    'yield',
    'yieldtime',
    'delaytime',
  ],
};

let checkOption = (optionKey: IOptionKey, value): void => {
  switch (optionKey) {
    case CHUNK:
      if (!isNumber(value) || value <= 0) {
        throw new TypeError(`'${optionKey.primary}' should be a positive number`);
      }
      break;
    case DELAY:
      if (!isNumber(value) || value < 0) {
        throw new TypeError(`'${optionKey.primary}' should be a non-negative number`);
      }
      break;
    case SCOPE:
      if (value === undefined || isBoolean(value) || isNumber(value)) {
        throw new TypeError(
          `'${optionKey.primary}' should not be undefined, a boolean, or a number`);
      }
      break;
    default:
      throw new TypeError(`Unknown option key ${optionKey}`);
  }
};

let mapsToOption = (optionKey: IOptionKey, key: string) => {
  return optionKey.primary === key || optionKey.aliases.indexOf(key) > -1;
};

let setOption = (object: Object, optionKey: IOptionKey, value) => {
  checkOption(optionKey, value);
  object[optionKey.primary] = value;
};

export var parseOptions = (options: IChunkifyOptions): IChunkifyOptions => {
  if (!isPlainObject(options) || Array.isArray(options) || isFunction(options)) {
    throw new TypeError(`Expected plain javascript object, got ${typeof options}`);
  }
  let parsed = <IChunkifyOptions> extend({}, DEFAULT_OPTIONS);
  forOwn(options, (value, key: string) => {
    if (mapsToOption(CHUNK, key)) {
      setOption(parsed, CHUNK, value);
    } else if (mapsToOption(DELAY, key)) {
      setOption(parsed, DELAY, value);
    } else if (mapsToOption(SCOPE, key)) {
      setOption(parsed, SCOPE, value);
    }
  });
  return Object.freeze(parsed);
};
