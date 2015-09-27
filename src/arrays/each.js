import _ from 'underscore'
import {ok_usage} from './utilities'
import {loop} from '../loops'


const USAGE = 'Usage: chunkify.each(Array array, Function fn, [Object options])';

let each = (array, fn, options = {}) => {
  ok_usage(array, fn, USAGE);
  return loop(function(index) {
    // loop will scope this to options.scope
    return fn.call(this, array[index], index);
  }, array.length, options).catch((error) => {
    // rethrow the error with the array item
    return Promise.reject(_.extend(error, {item: array[error.index]}))
  });
};


export default each