import ChunkifyOptions from '../options'
import _ from 'underscore'
import {ok_usage} from './utilities'
import {chunkify} from '../core'


const USAGE = 'Usage: chunkify.each(Array array, Function fn, [Object options])';

let each = (array, fn, options = {}) => {
  ok_usage(array, fn, USAGE);
  return chunkify(array, fn, ChunkifyOptions.of(options));
};


export default each