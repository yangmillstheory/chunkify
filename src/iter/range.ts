import {interval} from './interval';

export var range = (
  fn: (index: number) => void,
  length: number,
  options: IChOptions
) => {
  return interval(fn, 0, length, options);
};
