import 'babel/polyfill'
import array from './array'
import loop from './loop'
import range from './range'

export default {
  each: array.each,
  map: array.map,
  reduce: array.reduce,
  loop,
  range
}