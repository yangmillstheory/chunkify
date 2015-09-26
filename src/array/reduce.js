import each from './each'
import ChunkifyOptions from '../options'
import _ from 'underscore'
import {ok_usage} from './utilities'

const USAGE = 'Usage: chunkify.reduce(Array array, Function fn, [Object options])';
const MEMO_KEY = 'memo';

let reduce = (array, fn, options = {}) => {
  ok_usage(array, fn, USAGE);
  let initialize = () => {
    if (options.hasOwnProperty(MEMO_KEY)) {
      return {reducer: each.from_0, memo: options[MEMO_KEY]}
    } else {
      return {reducer: each.from_1, memo: array[0]}
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