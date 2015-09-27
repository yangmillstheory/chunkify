import 'babel/polyfill'
import arrays from './arrays'
import loops from './loops'

export default {
  each: arrays.each,
  map: arrays.map,
  reduce: arrays.reduce,
  loop: loops.loop,
  range: loops.range
}