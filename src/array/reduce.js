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
      return {skip_first: false, memo: options[MEMO_KEY]}
    } else {
      return {skip_first: true, memo: array[0]}
    }
  };
  let {memo, skip_first} = initialize();
  let reducee = function(item, index) {
    if (skip_first && index === 0) {
      return
    }
    // this will be scoped to options.scope
    memo = fn.call(this, memo, item, index, array);
  };
  return each.iterate(array, reducee, options).then(() => {
    return memo
  });
};


export default {apply: reduce};