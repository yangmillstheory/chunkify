import {each} from './each';
import {isFunction} from '../utility';


export var reduce = <T, U>(
  tArray,
  tReducer: (memo: U, tItem: T, index: number, tArray: T[]) => U,
  options: IChunkifyOptions = {},
  memo?: U
): Promise<U> => {
  if (!Array.isArray(tArray) || !tArray.length) {
    throw new TypeError(`Expected non-empty array, got ${typeof tArray}`);
  } else if (!isFunction(tReducer)) {
    throw new TypeError(`Expected function, got ${typeof tReducer}`);
  }
  let skipFirst = (memo === undefined);
  if (skipFirst) {
    memo = tArray[0];
  }
  let tConsumer = function(tItem: T, index: number) {
    if (skipFirst && index === 0) {
      return;
    }
    memo = tReducer.call(this, memo, tItem, index, tArray);
  };
  return each(tArray, tConsumer, options).then(() => { return memo; });
};
