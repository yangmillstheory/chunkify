import each from './each'
import ChunkifyOptions from '../options'
import {
  compose
} from '../utility'
import {checkUsage} from './utility'


const USAGE = 'Usage: chunkify.map(Array array, Function fn, [Object options])';

let map = (array, fn, options = {}) => {
  checkUsage(array, fn, USAGE);
  let chOpts = ChunkifyOptions.of(options);
  let mapped = [];
  let pusher = (result) => {
    mapped.push(result);
    return result;
  };
  let mapper = compose(pusher, fn.bind(chOpts.scope));
  return each(array, mapper, chOpts).then(() => {
    return mapped;
  });
};


export default map