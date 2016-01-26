import {range} from '../iter/range';
import {DEFAULT_OPTIONS} from '../options';
import {
  extend,
  assertFn,
  assertNonemptyArray,
} from '../utility';


export var each = <T>(
  tArray: T[],
  tConsumer: (tItem: T, index: number) => void,
  options: IChunkifyOptions = DEFAULT_OPTIONS
): Promise<void> => {
  assertNonemptyArray(tArray);
  assertFn(tConsumer);
  let indexConsumer = function(index: number): void {
    tConsumer.call(this, tArray[index], index);
  };
  return range(indexConsumer, tArray.length, options)
    .catch(error => {
      throw extend(error, {item: tArray[error.index]});
    });
};
