import {getLargeInt} from './large-int';
import {each, reduce, map, range} from 'chunkify';
import {
  RANGE,
} from './defaults';


let block = function(consumer: Function): (j: number) => number {
  return function(j: number): number {
    consumer();
    let i = 0;
    let max: number = getLargeInt();
    while (i < max) {
      i++;
    }
    return j;
  };
};

let reduceAction = function(
  consumer: Function,
  chunkified: boolean,
  options: IChunkifyOptions = null
): Promise<number> {
  let memo = 0;
  if (chunkified) {
    return reduce(RANGE, block(consumer), options, memo);
  }
  return Promise.resolve(RANGE.reduce(block(consumer), memo));
};

let mapAction = function(
  consumer: Function,
  chunkified: boolean,
  options: IChunkifyOptions = null
): Promise<number[]> {
  if (chunkified) {
    return map(RANGE, block(consumer), options);
  }
  return Promise.resolve(RANGE.map(block(consumer)));
};

let eachAction = function(
  consumer: Function,
  chunkified: boolean,
  options: IChunkifyOptions = null
): Promise<void> {
  if (chunkified) {
    return each(RANGE, block(consumer), options);
  }
  return Promise.resolve(RANGE.forEach(block(consumer)));
};

let rangeAction = function(
  consumer: Function,
  chunkified: boolean,
  options: IChunkifyOptions = null
): Promise<void> {
  if (chunkified) {
    return range(block(consumer), RANGE.length, options);
  }
  return Promise.resolve(function(): void {
    let blocked = block(consumer);
    for (let i = 0; i < RANGE.length; i++) {
      blocked(i);
    }
  }());
};

export enum ExperimentAction {
  EACH,
  MAP,
  RANGE,
  REDUCE,
};

export var applyAction = function(
  action: ExperimentAction,
  consumer: Function,
  chunkified: boolean,
  options: IChunkifyOptions
): Promise<void|number|number[]> {
  switch (action) {
    case ExperimentAction.EACH:
      return eachAction(consumer, chunkified, options);
    case ExperimentAction.MAP:
      return mapAction(consumer, chunkified, options);
    case ExperimentAction.REDUCE:
      return reduceAction(consumer, chunkified, options);
    case ExperimentAction.RANGE:
      return rangeAction(consumer, chunkified, options);
    default:
      throw new Error(`Unknown action ${action}`);
  }
};
