import {chunkify} from '../chunkify';
import {parseOptions} from '../options';
import {
  isFunction,
  isNumber,
} from '../utility';


let doChunk = (
  chIterator: IterableIterator<number|IChPause>,
  chConsumer: (index: number) => void
): IChPause => {
  let next = chIterator.next();
  let value: number|IChPause;
  while (!next.done) {
    value = next.value;
    if (typeof value !== 'number') {
      return <IChPause> value;
    }
    try {
      chConsumer(<number> value);
    } catch (error) {
      throw {error, index: value};
    }
    next = chIterator.next();
  }
  return null;
};

export var interval = (
  fn: (index: number) => void,
  start: number,
  final: number,
  options: IChOptions = {}
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
        return nextPause.resume(() => { return nextChunk(resolve, reject); });
      }
      resolve();
    } catch (error) {
      reject(error);
    }
  };
  return new Promise<void>(nextChunk);
};
