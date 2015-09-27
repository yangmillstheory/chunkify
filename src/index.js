import 'babel/polyfill'
import array from './array'
import loop from './loop'

export default {
  each: array.each,
  map: array.map,
  reduce: array.reduce,
  loop
}