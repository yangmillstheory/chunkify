import {chunkify} from '../chunkify';
import {parseOptions} from '../options';
import {
  isFunction,
  isNumber,
} from '../utility';


let doChunkSync = (
  chunkIterator: IterableIterator<number|IChPause>,
  indexConsumer: (index: number) => void
): IChPause => {
  let next = chunkIterator.next();
  let value: number|IChPause;
  while (!next.done) {
    value = next.value;
    if (typeof value !== 'number') {
      return <IChPause> value;
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

export var interval = (
  indexConsumer: (index: number) => void,
  start: number,
  final: number,
  options: IChOptions = {}
): Promise<void> => {
  if (!isFunction(indexConsumer)) {
    throw new Error(`Expected function; got ${typeof indexConsumer}`);
  } else if (!isNumber(start)) {
    throw new Error(`Expected number; got ${typeof start}`);
  } else if (!isNumber(final)) {
    throw new Error(`Expected number; got ${typeof final}`);
  } else if (start >= final) {
    throw new Error(`Expected start ${start} to be less than final ${final}`);
  }
  let chOptions = parseOptions(options);
  let chunkIterator = chunkify(start, final, chOptions);
  let boundConsumer = (index: number) => {
    indexConsumer.call(chOptions.scope, index);
  };
  let nextChunk = complete => {
    let nextPause = doChunkSync(chunkIterator, boundConsumer);
    if (nextPause) {
      return nextPause.resume(() => { return nextChunk(complete); });
    }
    complete();
  };
  return new Promise<void>(nextChunk);
};
