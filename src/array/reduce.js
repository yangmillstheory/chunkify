import {bounded_each} from './each'
import ChunkifyOptions from '../options'
import _ from 'underscore'
import {ok_usage} from './utilities'

let each_from_0 = bounded_each({from: 0});
let each_from_1 = bounded_each({from: 1});

const USAGE = 'Usage: chunkify.reduce(Array array, Function fn, [Object options])';
const MEMO_KEY = 'memo';

let reduce = (array, fn, options = {}) => {
  ok_usage(array, fn, USAGE);
  let initialize = () => {
    if (options.hasOwnProperty(MEMO_KEY)) {
      return {memo: options[MEMO_KEY], reducer: each_from_0}
    } else {
      return {memo: array[0], reducer: each_from_1}
    }
  };
  let {memo, reducer} = initialize();
  let reducee = function(item, index) {
    // this will be scoped to options.scope
    memo = fn.call(this, memo, item, index, array);
  };
  return reducer(array, reducee, options).then(() => {
    return memo
  });
};


export default {apply: reduce};