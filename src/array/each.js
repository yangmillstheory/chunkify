import ChunkifyOptions from '../options'
import _ from 'underscore'
import {ok_usage} from './utilities'


const USAGE = 'Usage: chunkify.each(Array array, Function fn, [Object options])';

import {chunkify} from '../core'

let iterate = (array, fn, options = {}) => {
  ok_usage(array, fn, USAGE);
  return chunkify(array, fn, ChunkifyOptions.of(options));
};



export default {iterate}