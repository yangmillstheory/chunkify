import ChunkifyOptions from '../options'
import _ from 'underscore'
import {verify_usage} from './utilities'


const USAGE = 'Usage: chunkify.each(Array array, Function fn, [Object options])';

let each = (array, fn, options = {}) => {
  verify_usage(array, fn, USAGE);
  let {chunk, delay} = ChunkifyOptions.of(options);
  let index = 0;
  let total = array.length;
  let incomplete = () => {
    return index < total;
  };
  var process_chunk = (resolve, reject) => {
    while (incomplete()) {
      let item = array[index++];
      try {
        fn(item)
      } catch (error) {
        return reject({error, item});
      }
      if (incomplete() && ((index % chunk) === 0)) {
        return setTimeout(process_chunk.bind(null, resolve, reject), delay);
      }
    }
    resolve(array);
  } ;
  return new Promise(process_chunk)
};


export default each