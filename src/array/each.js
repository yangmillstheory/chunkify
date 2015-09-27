import ChunkifyOptions from '../options'
import _ from 'underscore'
import {ok_usage} from './utilities'
import chunks from '../chunks'


const USAGE = 'Usage: chunkify.each(Array array, Function fn, [Object options])';

let each = (array, fn, options = {}) => {
  ok_usage(array, fn, USAGE);
  let {chunk, delay, scope} = ChunkifyOptions.of(options);
  let iterator = chunks.of({chunk, range: array.length});
  let resume = (resolve, reject) => {
    let {value, done} = iterator.next();
    if (done) {
      return resolve();
    }
    let {index, ok_chunk} = value;
    let item = array[index];
    try {
      fn.call(scope, item, index);
    } catch (error) {
      return reject({error, item, index})
    }
    if (ok_chunk) {
      return setTimeout(resume, delay, resolve, reject)
    }
    resume(resolve, reject);
  };
  return new Promise(resume);
};


export default each