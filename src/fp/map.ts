import {each} from './each';
import {
  compose
} from '../utility';


export var map = <T>(
  tArray: T[],
  tMapper: (item: T, index: number) => T,
  options: IChOptions = {}
): Promise<T[]> => {
  let mapped: T[] = [];
  let pusher = (mappedT: T): void => {
    mapped.push(mappedT);
  };
  let tConsumer = compose(pusher, tMapper);
  return each(tArray, tConsumer, options).then(() => { return mapped; });
};
