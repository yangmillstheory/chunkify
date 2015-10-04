import ChunkifyOptions from './options'
import _ from 'underscore'

// Return values from the range `start` to `final` synchronously
// when between intervals of size `chunk`.
//
// On the chunk boundary, return a promise that resolves in `delay` milliseconds.
//
// An error will be thrown in case an iterator is advanced before a pending
// promise has resolved.
function* chunkify(start, final, options) {
  let {chunk, delay} = options;
  let paused = false;
  let paused_error = (index) => {
    return new Error(`paused at index ${index}; wait ${delay} milliseconds before further invocations of .next()`)
  };
  function* pause() {
    yield new Promise(resolve => {
      paused = true;
      setTimeout(() => { resolve(); paused = false; }, delay)
    })
  }
  for (let index = start; index < final; index++) {
    if ((index > start) && (index % (start + chunk) === 0)) {
      yield* pause()
    }
    if (paused) {
      throw paused_error(index);
    }
    yield index
  }
}

export default {
  from_keywords: ({start, final, chunk, delay}) => {
    if (!_.isNumber(start)) {
      throw new Error('start index `start` of generator range must be a number')
    } else if (!_.isNumber(final)) {
      throw new Error('final index `final` of generator range must be a number')
    }
    return chunkify(start, final, ChunkifyOptions.of({chunk, delay}))
  }
}