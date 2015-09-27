import rangeloop from './range'
import ChunkifyOptions from '../options'
import _ from 'underscore'


const USAGE = 'Usage: chunkify.loop(Function fn, Number range, [Object options])';

let ok_usage = (fn, range) => {
  if (!_.isFunction(fn)) {
    throw new Error(`${USAGE} - bad fn; not a function`);
  } else if (!_.isNumber(range)) {
    throw new Error(`${USAGE} - bad range; not a number`);
  }
};

let loop = (fn, range, options = {}) => {
  ok_usage(fn, range);
  return rangeloop(fn, range, options);
};

export default loop