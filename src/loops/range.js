import chunkify from '../chunkify'
import ChunkifyOptions from '../options'
import _ from 'underscore'


const USAGE = 'Usage: chunkify.range(Function fn, Number final, [Object options])';

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


let range = (fn, final, options = {}) => {
  ok_usage(fn, final, options);
  let {scope, chunk, delay} = ChunkifyOptions.of(options);
  let iterator = chunkify.range({
    start: options.start || 0,
    final,
    chunk
  });
  var resume = (resolve, reject) => {
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
      setTimeout(resume, delay, resolve, reject);
    } else {
      resume(resolve, reject);
    }
  };
  return new Promise(resume);
};

export default range