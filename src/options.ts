import {
  isBoolean,
  isNumber,
  assertIsPlainObject,
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

let checkOption = function(optionKey: IOptionKey, value: any): void {
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

let mapsToOption = function(optionKey: IOptionKey, key: string): boolean {
  return optionKey.primary === key || optionKey.aliases.indexOf(key) > -1;
};

let setOption = function(object: {[key: string]: any}, optionKey: IOptionKey, value: any): void {
  checkOption(optionKey, value);
  object[optionKey.primary] = value;
};

export var parseOptions = function(options: IChunkifyOptions): IChunkifyOptions {
  assertIsPlainObject(options);
  let parsed = <IChunkifyOptions> extend({}, DEFAULT_OPTIONS);
  forOwn(options, function(value: any, key: string): void {
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
