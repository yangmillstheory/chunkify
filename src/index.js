import 'babel/polyfill'
import array from './array'

export function each() {
  return array.each(...arguments)
}

export function map() {
  return array.map(...arguments)
}

export default {each, map}