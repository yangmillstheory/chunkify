import ChunkifyOptions from '../options'
import _ from 'underscore'
import {ok_usage} from './utilities'
import {loop} from '../loops'


const USAGE = 'Usage: chunkify.each(Array array, Function fn, [Object options])';

let each = (array, fn, options = {}) => {
  ok_usage(array, fn, USAGE);
  let okopts = ChunkifyOptions.of(options);
  return loop(function(index) {
    return fn.call(okopts.scope, array[index], index);
  }, array.length, okopts).catch((error) => {
    // rethrow the error with the array item
    return Promise.reject(_.extend(error, {item: array[error.index]}))
  });
};


export default each