import each from './each'
import ChunkifyOptions from '../options'
import _ from 'underscore'
import {ok_usage} from './utilities'


const USAGE = 'Usage: chunkify.map(Array array, Function fn, [Object options])';

let map = (array, fn, options) => {
  ok_usage(array, fn, USAGE);
  let mapped = [];
  let pusher = (result) => {
    mapped.push(result);
    return result;
  };
  let mapper = _.compose(pusher, fn);
  return each.apply(array, mapper, options).then(() => {
    return mapped;
  });
};


export default {apply: map}