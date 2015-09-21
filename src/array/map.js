import chunkify from '../index'
import ChunkifyOptions from '../options'
import _ from 'underscore'
import {verify_usage} from './utilities'


const USAGE = 'Usage: chunkify.map(Array array, Function fn, [Object options])';

let map = (array, fn, options) => {
  verify_usage(array, fn, USAGE);
  let mapped = [];
  let pusher = (result) => {
    mapped.push(result);
    return result;
  };
  let mapper = _.compose(pusher, fn);
  return chunkify.each(array, mapper, options).then(() => {
    return mapped;
  });
};


export default map