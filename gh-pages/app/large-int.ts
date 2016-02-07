import * as _ from 'lodash';


const default_max = Math.pow(10, 2);
const default_min = default_max * .75;

export function getLargeInt(options: {max?: number, min?: number} = {}): number {
  let min: number = _.isNumber(options.min) ? options.min : default_min;
  let max: number = _.isNumber(options.max) ? options.max : default_max;
  return Math.floor(Math.random() * (max - min) + min);
};
