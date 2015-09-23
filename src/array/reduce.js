import {each} from './each'
import ChunkifyOptions from '../options'
import _ from 'underscore'
import {ok_usage} from './utilities'

let start_at_0_reducer = each(0);
let start_at_1_reducer = each(1);

const USAGE = 'Usage: chunkify.reduce(Array array, Function fn, [Object options])';
const MEMO_KEY = 'memo';

let reduce = (array, fn, options = {}) => {
  ok_usage(array, fn, USAGE);
  let initialize = () => {
    if (options.hasOwnProperty(MEMO_KEY)) {
      return {memo: options[MEMO_KEY], reducer: start_at_0_reducer}
    } else {
      return {memo: array[0], reducer: start_at_1_reducer}
    }
  };
  let {memo, reducer} = initialize();
  let reducee = function(item, index) {
    // this will be scoped to options.scope
    memo = fn.call(this, memo, item, index, array);
  };
  reducer(array, reducee, options).then(() => {
    return memo
  });
};


export default {apply: map};