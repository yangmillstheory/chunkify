import {range} from '../iter/range';
import {DEFAULT_OPTIONS} from '../options';
import {
  extend,
  isFunction,
} from '../utility';


export var each = <T>(
  tArray: T[],
  tConsumer: (tItem: T, index: number) => void,
  options: IChunkifyOptions = DEFAULT_OPTIONS
): Promise<void> => {
  if (!Array.isArray(tArray)) {
    throw new TypeError(`Expected array, got ${typeof tArray}`);
  } else if (!tArray.length) {
    throw new Error('Expected non-empty array');
  } else if (!isFunction(tConsumer)) {
    throw new TypeError(`Expected function, got ${typeof tConsumer}`);
  }
  let indexConsumer = function(index: number): void {
    tConsumer.call(this, tArray[index], index);
  };
  return range(indexConsumer, tArray.length, options)
    .catch(error => {
      throw extend(error, {item: tArray[error.index]});
    });
};
