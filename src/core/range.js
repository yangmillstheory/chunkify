import interval from './interval'
import ChunkifyOptions from '../options'
import _ from 'underscore'


const USAGE = 'Usage: chunkify.range(Function fn, Number range, [Object options])';

let ok_usage = (fn, range) => {
  if (!_.isFunction(fn)) {
    throw new Error(`${USAGE} - bad fn; not a function`);
  } else if (!_.isNumber(range)) {
    throw new Error(`${USAGE} - bad range; not a number`);
  }
};

let range = (fn, range, options = {}) => {
  ok_usage(fn, range);
  delete options.start;
  return interval(fn, range, options);
};

export default range