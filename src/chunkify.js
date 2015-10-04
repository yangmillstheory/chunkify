let pending_delay_error = (index) => {
  let pending_delay = `pending delay at index: ${index}; `;
  pending_delay += `wait ${delay} milliseconds before `;
  pending_delay += `further invocations of .next()`;
  throw new Error(pending_delay)
};

// Return values from the range `start` to `final` synchronously when between
// intervals of size `chunk`.
//
// Otherwise, return a promise that resolves in `delay` milliseconds.
//
// An error will be thrown in case the iterator is advanced before a
// pending promise has resolved.
function* chunkify(start, final, chunk, delay) {
  let delayed = null;
  let pending = null;
  function* do_delay() {
    yield new Promise(resolve => {
      setTimeout(() => {
        delayed = false;
        pending = false;
        resolve();
      }, delay)
    })
  }
  for (let index = start; index < final; index++) {
    if ((index > start) && (index % (start + chunk) === 0)) {
      delayed = true;
      pending = true;
      yield* do_delay()
    }
    if (delayed && pending) {
      pending_delay_error(index);
    }
    yield index
  }
}

export default {
  interval: ({start, final, chunk, delay}) => {
    return chunkify(start, final, chunk, delay)
  }
}