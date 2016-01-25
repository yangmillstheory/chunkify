import {each} from './each';
import {
  compose
} from '../utility';


export var map = <T>(
  tArray: T[],
  tMapper: (iItem: T, index: number) => T,
  options: IChOptions = {}
): Promise<T[]> => {
  let tMapped: T[] = [];
  let tPusher = (tMappedItem: T): void => {
    tMapped.push(tMappedItem);
  };
  let tConsumer = compose(tPusher, tMapper);
  return each(tArray, tConsumer, options).then(() => { return tMapped; });
};
