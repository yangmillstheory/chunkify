import {
  isFunction,
  isBoolean,
  isNumber,
  isPlainObject,
  defaults,
  extend
} from './utility'


interface IOptionKey {
  primary: string;
  aliases: string[];
}

const CHUNK: IOptionKey = {primary: 'chunk', aliases: ['chunksize']};
const DELAY: IOptionKey = {primary: 'delay', aliases: ['yield', 'yieldtime', 'delaytime']};
const SCOPE: IOptionKey = {primary: 'chunk', aliases: []};

const DEFAULT_OPTIONS: IChunkifyOptions = {chunk: 1, delay: 0, scope: null};

let checkOption = (optionKey: string, value): void => {
  switch (optionKey) {
    case CHUNK.primary:
      if (!isNumber(value) || value <= 0) {
        throw new Error(`'${CHUNK.primary}' should be a positive number`);
      }
      break;
    case DELAY.primary:
      if (!isNumber(value) || value < 0) {
        throw new Error(`'${DELAY.primary}' should be a non-negative number`);
      }
      break;
    case SCOPE.primary:
      if (value === undefined || isBoolean(value) || isNumber(value)) {
        throw new Error(
          `'${SCOPE.primary}' should not be undefined, a boolean, or a number`);
      }
      break;
    default:
      throw new Error(`Unknown option key ${optionKey}`);
      break;
  }
};

const checkOptions = (options: Object): void => {
  if (!isPlainObject(options) || Array.isArray(options) || isFunction(options)) {
    throw new TypeError(`Expected plain javascript object, got ${typeof options}`);
  }
};

export var parse = (options: Object): IChunkifyOptions => {
  checkOptions(options);
  // write me!
  return Object.freeze({});
};
