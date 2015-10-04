// Return values from the range `start` to `final` synchronously
// when between intervals of size `chunk`.
//
// On the chunk boundary, return a promise that resolves in `delay` milliseconds.
//
// An error will be thrown in case an iterator is advanced before a pending
// promise has resolved.
function* chunkify(start, final, chunk, delay) {
  let delayed = false;
  let pending_delay_error = (index) => {
    let pending_delay = `pending delay at index ${index}; `;
    pending_delay += `wait ${delay} milliseconds before `;
    pending_delay += `further invocations of .next()`;
    throw new Error(pending_delay)
  };
  function* do_delay() {
    yield new Promise(resolve => {
      delayed = true;
      setTimeout(() => { resolve(); delayed = false; }, delay)
    })
  }
  for (let index = start; index < final; index++) {
    if ((index > start) && (index % (start + chunk) === 0)) {
      yield* do_delay()
    }
    if (delayed) {
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