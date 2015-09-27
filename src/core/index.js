import chunks from './chunks'


let chunkify = (array, fn, options = {}) => {
  let {chunk, delay, scope} = options;
  let iterator = chunks.of({chunk, range: array.length});
  let resume = (resolve, reject) => {
    let {value, done} = iterator.next();
    if (done) {
      return resolve();
    }
    let {index, ok_chunk} = value;
    let item = array[index];
    try {
      fn.call(scope, item, index);
    } catch (error) {
      return reject({error, item, index})
    }
    if (ok_chunk) {
      return setTimeout(resume, delay, resolve, reject)
    }
    resume(resolve, reject);
  };
  return new Promise(resume);
};

export default {chunkify}