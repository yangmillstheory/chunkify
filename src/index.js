import 'babel/polyfill'
import arrays from './arrays'
import core from './core'
import chunkify from './chunkify'

export default {
  each: arrays.each,
  map: arrays.map,
  reduce: arrays.reduce,
  interval: core.interval,
  range: core.range,
  generator: chunkify.interval
}