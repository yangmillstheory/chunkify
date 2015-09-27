import chunkify from '../chunkify'
import ChunkifyOptions from '../options'
import _ from 'underscore'


const USAGE = 'Usage: chunkify.range(Function fn, Number final, [Object options])';

let ok_usage = (fn, final, options) => {
  if (!_.isFunction(fn)) {
    throw new Error(`${USAGE} - bad fn`);
  } else  if (!_.isNumber(final)) {
    throw new Error(`${USAGE} - bad final`);
  }
  let {start} = options;
  if (start != null) {
    if (!_.isNumber(start)) {
      throw new Error(`${USAGE} - bad start`);
    } else if (start > final) {
      throw new Error(`${USAGE} - bad start`);
    }
  }
};


let range = (fn, final, options = {}) => {
  ok_usage(fn, final, options);
  let {scope, chunk, delay} = ChunkifyOptions.of(options);
  let iterator = chunkify.range({
    start: options.start || 0,
    final,
    chunk
  });
  let resume = (resolve, reject) => {
    let next = iterator.next();
    if (next.done) {
      return resolve();
    }
    let {index, pause} = next.value;
    try {
      fn.call(scope, index)
    } catch (error) {
      return reject({error, index});
    }
    if (pause) {
      return setTimeout(resume, delay, resolve, reject);
    }
    return resume(resolve, reject);
  };
  return new Promise(resume);
};

export default range