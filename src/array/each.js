import ChunkifyOptions from '../options'
import _ from 'underscore'
import {ok_usage} from './utilities'


const USAGE = 'Usage: chunkify.each(Array array, Function fn, [Object options])';

let bounded_each = ({from, to}) => {
  return (array, fn, options = {}) => {
    ok_usage(array, fn, USAGE);
    let {chunk, delay, scope} = ChunkifyOptions.of(options);
    let {index, final} = _.defaults({index: from, final: to}, {
      index: 0,
      final: array.length
    });
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
};



export default {
  from_0: bounded_each({from: 0}),
  from_1: bounded_each({from: 1})
}