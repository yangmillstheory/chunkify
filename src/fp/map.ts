import {each} from './each';
import {parseOptions} from '../options';
import {
  compose
} from '../utility';


export var map = <T>(
  array: T[],
  tMapper: (item: T, index: number) => T,
  options: IChOptions = {}
) => {
  let mapped: T[] = [];
  let chOpts = parseOptions(options);
  let pusher = (mappedT: T): void => {
    mapped.push(mappedT);
  };
  let tConsumer = compose(pusher, tMapper, chOpts.scope);
  return each(array, tConsumer, chOpts).then(() => { return mapped; });
};
