import {
  parseOptions,
  DEFAULT_OPTIONS,
} from './options';
import {isNumber} from './utility';
import {Pause} from './pause';


// return values from the range "start" to "final"
// synchronously when between intervals of size "chunk".
//
// on the boundary, return a promise that resolves in "delay" milliseconds.
//
// an error will be thrown in case an iterator is advanced before this promise resolves.
let __chunkify__: (
  start: number,
  final: number,
  options: IChunkifyOptions
) => IterableIterator<number|IPause> = function*(
  start: number,
  final: number,
  options: IChunkifyOptions
) {
  let {
    chunk,
    delay,
  } = options;
  let paused = false;
  let pause = function*() {
    paused = true;
    yield Pause.for(delay).resume(() => { paused = false; });
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

export var generator = (start: number, final: number, options: IChunkifyOptions = DEFAULT_OPTIONS) => {
  if (!isNumber(start)) {
    throw new Error('start index "start" of generator range must be a number');
  } else if (!isNumber(final)) {
    throw new Error('final index "final" of generator range must be a number');
  }
  return __chunkify__(start, final, parseOptions(options));
};