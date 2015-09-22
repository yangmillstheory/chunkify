import ChunkifyOptions from '../options'
import _ from 'underscore'
import {ok_usage} from './utilities'


const USAGE = 'Usage: chunkify.each(Array array, Function fn, [Object options])';

let each = (array, fn, options = {}) => {
  ok_usage(array, fn, USAGE);
  let parse_options = () => {
    if (ChunkifyOptions.is(options)) {
      return options;
    } else {
      return ChunkifyOptions.of(options);
    }
  };
  let {chunk, delay, scope} = parse_options();
  let index = 0;
  let total = array.length;
  let incomplete = () => {
    return index < total;
  };
  var process_chunk = (resolve, reject) => {
    while (incomplete()) {
      let item = array[index++];
      try {
        fn.call(scope, item)
      } catch (error) {
        return reject({error, item});
      }
      if (incomplete() && ((index % chunk) === 0)) {
        return setTimeout(process_chunk.bind(null, resolve, reject), delay);
      }
    }
    resolve();
  } ;
  return new Promise(process_chunk)
};


export default {apply: each}