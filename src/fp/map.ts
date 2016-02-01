import {each} from './each';
import {DEFAULT_OPTIONS} from '../options';
import {
  compose
} from '../utility';


export var map = function<T>(
  tArray: T[],
  tMapper: (iItem: T, index: number) => T,
  options: IChunkifyOptions = DEFAULT_OPTIONS
): Promise<T[]> {
  let tMapped: T[] = [];
  let tPusher = function(tMappedItem: T): void {
    tMapped.push(tMappedItem);
  };
  let tConsumer = compose(tPusher, tMapper);
  return each(tArray, tConsumer, options).then(function() { return tMapped; });
};
