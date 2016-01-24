import {range} from '../iter/range';
import {
  extend,
  isFunction,
} from '../utility';


export var each = <T>(
  tArray: T[],
  tConsumer: (item: T, index: number) => void,
  options: IChOptions = {}
): Promise<void> => {
  if (!Array.isArray(tArray)) {
    throw new TypeError(`Expected array, got ${typeof tArray}`);
  } else if (!isFunction(tConsumer)) {
    throw new TypeError(`Expected function, got ${typeof tConsumer}`);
  }
  let indexConsumer = (index: number): void => {
    tConsumer(tArray[index], index);
  };
  return range(indexConsumer, tArray.length, options)
    .catch(error => {
      Promise.reject(extend(error, {item: tArray[error.index]}));
    });
};
