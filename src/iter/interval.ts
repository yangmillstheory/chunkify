import {generator} from '../generator';
import {
  parseOptions,
  DEFAULT_OPTIONS,
} from '../options';
import {
  assertNumber,
  assertFn,
} from '../utility';


let doChunkSync = function(
  chunkIterator: IterableIterator<number|IPause>,
  indexConsumer: (index: number) => void
): IPause {
  let next = chunkIterator.next();
  let value: number|IPause;
  while (!next.done) {
    value = next.value;
    if (typeof value !== 'number') {
      return <IPause> value;
    }
    try {
      indexConsumer(<number> value);
    } catch (error) {
      throw {error, index: value};
    }
    next = chunkIterator.next();
  }
  return null;
};

export var interval = function(
  indexConsumer: (index: number) => void,
  start: number,
  final: number,
  options: IChunkifyOptions = DEFAULT_OPTIONS
): Promise<void> {
  assertFn(indexConsumer);
  assertNumber(start);
  assertNumber(final);
  if (start >= final) {
    throw new Error(`Expected start ${start} to be less than final ${final}`);
  }
  let chOptions = parseOptions(options);
  let chunkIterator = generator(start, final, chOptions);
  let boundConsumer = (index: number) => {
    // FIXME - this (and similar upstream invocations) are untyped!
    // 
    //   https://github.com/Microsoft/TypeScript/issues/212
    indexConsumer.call(chOptions.scope, index);
  };
  let nextChunkExecutor = function(complete: Function) {
    let nextPause = doChunkSync(chunkIterator, boundConsumer);
    if (nextPause) {
      return nextPause.resume(() => { return nextChunkExecutor(complete); });
    }
    complete();
  };
  return new Promise<void>(nextChunkExecutor);
};
