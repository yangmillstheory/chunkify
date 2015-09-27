import chunks from './chunks'
import ChunkifyOptions from './options'
import _ from 'underscore'


const USAGE = 'Usage: chunkify.loop(Number range, Function fn, [Object options])';

let ok_usage = (range, fn) => {
  if (!_.isNumber(range)) {
    throw new Error(USAGE);
  } else if (!_.isFunction(fn)) {
    throw new Error(USAGE);
  }
};

let loop = (range, fn, options = {}) => {
  ok_usage(range, fn);
  let {scope, chunk, delay} = ChunkifyOptions.of(options);
  let iterator = chunks.of({chunk, range});
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
    resume(resolve, reject);
  };
  return new Promise(resume);
};

export default loop