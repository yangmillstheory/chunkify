import ChunkifyOptions from './options'


let array = (array, fn, options = {}) => {
  if (!Array.isArray(array)) {
    throw new TypeError(`Expected Array 'array', got ${typeof array}`)
  } else if (!_.isFunction(fn)) {
    throw new TypeError(`Expected function 'fn', got ${typeof fn}`)
  }
  let {CHUNK, DELAY} = ChunkifyOptions.of(options);
  let index = 0;
  let total = array.length;
  let incomplete = () => {
    return index < total;
  };
  var process_chunk = (resolve, reject) => {
    while (incomplete()) {
      try {
        fn(array[index++])
      } catch (e) {
        reject(e);
      }
      if (incomplete() && (index % CHUNK === 0)) {
        return setTimeout(process_chunk.bind(null, resolve, reject), DELAY);
      }
    }
    resolve(array);
  } ;
  return new Promise(process_chunk)
};


export default array