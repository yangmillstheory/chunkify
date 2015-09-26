import ChunkifyOptions from '../options'
import _ from 'underscore'
import {ok_usage} from './utilities'


const USAGE = 'Usage: chunkify.each(Array array, Function fn, [Object options])';

let iterate = (array, fn, options = {}) => {
  ok_usage(array, fn, USAGE);
  let {chunk, delay, scope} = ChunkifyOptions.of(options);
  let index = 0;
  let final = array.length;
  let incomplete = () => {
    return index < final;
  };
  var process_chunk = (resolve, reject) => {
    while (incomplete()) {
      let item = array[index];
      try {
        fn.call(scope, item, index)
      } catch (error) {
        return reject({error, item, index});
      }
      index++;
      if (incomplete() && ((index % chunk) === 0)) {
        return setTimeout(process_chunk.bind(null, resolve, reject), delay);
      }
    }
    resolve();
  } ;
  return new Promise(process_chunk)
};



export default {iterate}