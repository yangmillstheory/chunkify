import {parseOptions} from './options';
import {
  isNumber
} from './utility';

// Return values from the range start to final synchronously
// when between intervals of size chunk.
//
// On the chunk boundary, return a promise that resolves in delay milliseconds.
//
// An error will be thrown in case an iterator is advanced before a pending
// promise has resolved.
let __chunkify__: IChunkifyGenerator = function*(
  start: number,
  final: number,
  options: IChunkifyOptions
) {
  let {chunk, delay} = options;
  let paused = false;
  let pause = function*() {
    yield new Promise<void>(resolve => {
      paused = true;
      setTimeout(() => { resolve(); paused = false; }, delay);
    });
  };
  for (let index = start; index < final; index++) {
    if ((index > start) && (index % (start + chunk) === 0)) {
      yield *pause();
    }
    if (paused) {
      throw new Error(`paused at index ${index}; wait ${delay} milliseconds before further invocations of .next()`);
    }
    yield index;
  }
};

export var chunkify: IChunkifyGenerator = (start: number, final: number, options: IChunkifyOptions = {}) => {
  if (!isNumber(start)) {
    throw new Error('start index "start" of generator range must be a number');
  } else if (!isNumber(final)) {
    throw new Error('final index "final" of generator range must be a number');
  }
  return __chunkify__(start, final, parseOptions(options));
};
