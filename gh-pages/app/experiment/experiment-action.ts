import {each, reduce, map, range} from 'chunkify';
import {
  RANGE,
} from './experiment-defaults';


let block = function(consumer: Function): (j: number) => number {
  return function(j: number): number {
    consumer();
    let i = 0;
    let max = Math.pow(10, 2);
    while (i < max) {
      i++;
    }
    return j;
  };
};

let reduceAction = function(
  consumer: (i: number) => number,
  chunkified: boolean,
  options: IChunkifyOptions = null
): Promise<number> {
  let memo = 0;
  if (chunkified) {
    return reduce(RANGE, consumer, options, memo);
  }
  return Promise.resolve(RANGE.reduce(consumer, memo));
};

let mapAction = function(
  consumer: (i: number) => number,
  chunkified: boolean,
  options: IChunkifyOptions = null
): Promise<number[]> {
  if (chunkified) {
    return map(RANGE, consumer, options);
  }
  return Promise.resolve(RANGE.map(consumer));
};

let eachAction = function(
  consumer: (i: number) => number,
  chunkified: boolean,
  options: IChunkifyOptions = null
): Promise<void> {
  if (chunkified) {
    return each(RANGE, consumer, options);
  }
  return Promise.resolve(RANGE.forEach(consumer));
};

let rangeAction = function(
  consumer: (i: number) => number,
  chunkified: boolean,
  options: IChunkifyOptions = null
): Promise<void> {
  if (chunkified) {
    return range(consumer, RANGE.length, options);
  }
  return Promise.resolve(function(): void {
    let blocked = consumer;
    for (let i = 0; i < RANGE.length; i++) {
      blocked(i);
    }
  }());
};

export enum ExperimentAction {
  EACH,
  MAP,
  REDUCE,
  RANGE
}

export var applyAction = function(
  action: ExperimentAction,
  consumer: Function,
  chunkified: boolean,
  options: IChunkifyOptions
): Promise<void|number|number[]> {
  let blockedConsumer = block(consumer);
  switch (action) {
    case ExperimentAction.EACH:
      return eachAction(blockedConsumer, chunkified, options);
    case ExperimentAction.MAP:
      return mapAction(blockedConsumer, chunkified, options);
    case ExperimentAction.REDUCE:
      return reduceAction(blockedConsumer, chunkified, options);
    case ExperimentAction.RANGE:
      return rangeAction(blockedConsumer, chunkified, options);
    default:
      throw new Error(`Unknown action ${action}`);
  }
};
