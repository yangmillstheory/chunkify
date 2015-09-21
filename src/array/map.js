import each from './each'
import ChunkifyOptions from '../options'

const USAGE = 'Usage: chunkify.map(Array array, Function fn, [Object options])';

let map = (array, fn, options) => {
  let mapped = [];
  let mapper = (item) => {
    let result = fn(item);
    mapped.push(result);
    return result;
  };
  return each(array, mapper, options).then(() => {
    return mapped;
  });
};


export default map