import chunkify from '../index'
import ChunkifyOptions from '../options'
import {
  isFunction,
  isNumber
} from '../utility'


const USAGE = 'Usage: chunkify.interval(Function fn, Number final, [Object options])';

let checkUsage = (fn, final, options) => {
  if (!isFunction(fn)) {
    throw new Error(`${USAGE} - bad fn; not a function`);
  } else  if (!isNumber(final)) {
    throw new Error(`${USAGE} - bad final; not a number`);
  }
  let {start} = options;
  if (start != null) {
    if (!isNumber(start)) {
      throw new Error(`${USAGE} - bad start; not a number`);
    } else if (start > final) {
      throw new Error(`${USAGE} - bad start; it's greater than final`);
    }
  }
};

let interval = (fn, final, options = {}) => {
  checkUsage(fn, final, options);
  let start = options.start || 0;
  let chOptions = ChunkifyOptions.of(options);
  let generator = chunkify.generator(start, final, chOptions);
  var processChunkSync = (resolve, reject) => {
    let next = generator.next();
    while (!(next.value instanceof Promise) && !next.done) {
      try {
        fn.call(chOptions.scope, next.value)
      } catch (error) {
        return reject({error, index: next.value});
      }
      next = generator.next();
    }
    if (next.done) {
      return resolve();
    }
    return next.value.then(() => {
      return processChunkSync(resolve, reject)
    });
  };
  return new Promise(processChunkSync);
};

export default interval