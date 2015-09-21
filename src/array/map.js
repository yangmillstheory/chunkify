import each from './each'
import ChunkifyOptions from '../options'
import _ from 'underscore'
import {verify_usage} from './utilities'


const USAGE = 'Usage: chunkify.map(Array array, Function fn, [Object options])';

let map = (array, fn, options) => {
  verify_usage(array, fn, USAGE);
  let map_results = [];
  let push_result = (result) => {
    map_results.push(result);
    return result;
  };
  return each(array, _.compose(push_result, fn), options).then(() => {
    return map_results;
  });
};


export default map