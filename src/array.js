import ChunkifyOptions from './options'


let array = (array, fn, options = {}) => {
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