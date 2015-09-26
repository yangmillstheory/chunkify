import each from './each'
import ChunkifyOptions from '../options'
import _ from 'underscore'
import {ok_usage} from './utilities'


const USAGE = 'Usage: chunkify.map(Array array, Function fn, [Object options])';

let map = (array, fn, options = {}) => {
  ok_usage(array, fn, USAGE);
  let okopts = ChunkifyOptions.of(options);
  let mapped = [];
  let pusher = (result) => {
    mapped.push(result);
    return result;
  };
  let mapper = _.compose(pusher, fn.bind(okopts.scope));
  return each.iterate(array, mapper, okopts).then(() => {
    return mapped;
  });
};


export default {apply: map}