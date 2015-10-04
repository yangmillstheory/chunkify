import chunkify from '../index'
import ChunkifyOptions from '../options'
import _ from 'underscore'


const USAGE = 'Usage: chunkify.interval(Function fn, Number final, [Object options])';

let ok_usage = (fn, final, options) => {
  if (!_.isFunction(fn)) {
    throw new Error(`${USAGE} - bad fn; not a function`);
  } else  if (!_.isNumber(final)) {
    throw new Error(`${USAGE} - bad final; not a number`);
  }
  let {start} = options;
  if (start != null) {
    if (!_.isNumber(start)) {
      throw new Error(`${USAGE} - bad start; not a number`);
    } else if (start > final) {
      throw new Error(`${USAGE} - bad start; it's greater than final`);
    }
  }
};

let interval = (fn, final, options = {}) => {
  ok_usage(fn, final, options);
  let start = options.start || 0;
  let okoptions = ChunkifyOptions.of(options);
  let generator = chunkify.generator(start, final, okoptions);
  var process_chunk_sync = (resolve, reject) => {
    let next = generator.next();
    while (!(next.value instanceof Promise) && !next.done) {
      try {
        fn.call(okoptions.scope, next.value)
      } catch (error) {
        return reject({error, index: next.value});
      }
      next = generator.next();
    }
    if (next.done) {
      return resolve();
    }
    return next.value.then(() => {
      return process_chunk_sync(resolve, reject)
    });
  };
  return new Promise(process_chunk_sync);
};

export default interval