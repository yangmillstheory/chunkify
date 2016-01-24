import {each} from './fp/each';
import {map} from './fp/map';
import {reduce} from './fp/reduce';
import {range} from './iter/range';
import {interval} from './iter/interval';
import {chunkify} from './chunkify';


export default {each, map, reduce, interval, range, generator: chunkify};
