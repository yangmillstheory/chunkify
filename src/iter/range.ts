import {interval} from './interval';

export var range = (
  indexConsumer: (index: number) => void,
  length: number,
  options: IChunkifyOptions
): Promise<void> => {
  return interval(indexConsumer, 0, length, options);
};
