import ChunkifyOptions from './options'
import {
  isNumber
} from './utility'

// Return values from the range start to final synchronously
// when between intervals of size chunk.
//
// On the chunk boundary, return a promise that resolves in delay milliseconds.
//
// An error will be thrown in case an iterator is advanced before a pending
// promise has resolved.
function* chunkify(start, final, options) {
  let {chunk, delay} = options;
  let paused = false;
  let stillPaused = (index) => {
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
      throw stillPaused(index);
    }
    yield index
  }
}

export default {
  of: (start, final, options = {}) => {
    if (!isNumber(start)) {
      throw new Error('start index `start` of generator range must be a number')
    } else if (!isNumber(final)) {
      throw new Error('final index `final` of generator range must be a number')
    }
    return chunkify(start, final, ChunkifyOptions.of(options))
  }
}