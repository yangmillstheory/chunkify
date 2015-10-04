// Return values from the range `start` to `final` synchronously
// when between intervals of size `chunk`.
//
// On the chunk boundary, return a promise that resolves in `delay` milliseconds.
//
// An error will be thrown in case an iterator is advanced before a pending
// promise has resolved.
function* chunkify(start, final, chunk, delay) {
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
  interval: ({start, final, chunk, delay}) => {
    return chunkify(start, final, chunk, delay)
  }
}