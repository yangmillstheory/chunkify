import {each} from './each';
import {
  compose
} from '../utility';


export var map = <T>(
  array: T[],
  tMapper: (item: T, index: number) => T,
  options: IChOptions = {}
) => {
  let mapped: T[] = [];
  let pusher = (mappedT: T): void => {
    mapped.push(mappedT);
  };
  let tConsumer = compose(pusher, tMapper);
  return each(array, tConsumer, options).then(() => { return mapped; });
};
