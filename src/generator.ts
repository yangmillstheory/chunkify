import {
  parseOptions,
  DEFAULT_OPTIONS,
} from './options';
import {assertNumber} from './utility';
import {Pause} from './pause';


// return values from the range "start" to "final"
// synchronously when between intervals of size "chunk".
//
// on the boundary, return a promise that resolves in "delay" milliseconds.
//
// an error will be thrown in case an iterator is advanced before this promise resolves.
let __chunkify__ = function*(
  start: number,
  final: number,
  options: IChunkifyOptions
): IterableIterator<number|IPause> {
  let {
    chunk,
    delay,
  } = options;
  let paused = false;
  let pause = function*(): IterableIterator<IPause> {
    paused = true;
    yield Pause.for(delay).resume(function(): void { paused = false; });
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

export var generator = function(
  start: number,
  final: number,
  options: IChunkifyOptions = DEFAULT_OPTIONS
): IterableIterator<number|IPause> {
  assertNumber(start);
  assertNumber(final);
  return __chunkify__(start, final, parseOptions(options));
};
