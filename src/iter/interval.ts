import {chunkify} from '../chunkify';
import {parseOptions} from '../options';
import {
  isFunction,
  isNumber,
} from '../utility';


let doChunk = <T>(
  iterator: IterableIterator<number|Promise<T>>,
  consumer: (index: number) => void
): Promise<T> => {
  let next = iterator.next();
  while (!next.done) {
    if (next.value instanceof Promise) {
      return <Promise<T>> next.value;
    }
    try {
      consumer(<number> next.value);
    } catch (error) {
      throw {error, index: next.value};
    }
    next = iterator.next();
  }
  return null;
};

export var interval = (
  fn: (index: number) => void,
  start: number,
  final: number,
  options: IChunkifyOptions = {}
): Promise<void> => {
  if (!isFunction(fn)) {
    throw new Error(`Expected function; got ${typeof fn}`);
  } else if (!isNumber(start)) {
    throw new Error(`Expected number; got ${typeof start}`);
  } else if (!isNumber(final)) {
    throw new Error(`Expected number; got ${typeof final}`);
  } else if (start >= final) {
    throw new Error(`Expected start ${start} to be less than final ${final}`);
  }
  let chOptions = parseOptions(options);
  let chIterator = chunkify(start, final, chOptions);
  let chConsumer = (index: number) => {
    fn.call(chOptions.scope, index);
  };
  let nextChunk = (resolve, reject) => {
    try {
      let nextPause = doChunk(chIterator, chConsumer);
      if (nextPause) {
        return nextPause.then(() => { return nextChunk(resolve, reject); });
      }
      return resolve();
    } catch (error) {
      return reject(error);
    }
  }
  return new Promise<void>(nextChunk);
};
