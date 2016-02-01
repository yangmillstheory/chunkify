import {each} from './each';
import {DEFAULT_OPTIONS} from '../options';
import {
  assertFn,
  assertNonemptyArray,
} from '../utility';


export var reduce = function<T, U>(
  tArray: T[],
  tReducer: (current: U, tItem: T, index: number, tArray: T[]) => U,
  options: IChunkifyOptions = DEFAULT_OPTIONS,
  memo?: U
): Promise<U> {
  assertNonemptyArray(tArray);
  assertFn(tReducer);
  let skipFirst = (memo === undefined);
  if (skipFirst) {
    memo = <U><any>tArray[0];
  }
  let tConsumer = function(tItem: T, index: number) {
    if (skipFirst && index === 0) {
      return;
    }
    memo = tReducer.call(this, memo, tItem, index, tArray);
  };
  return each(tArray, tConsumer, options).then(function() { return memo; });
};
