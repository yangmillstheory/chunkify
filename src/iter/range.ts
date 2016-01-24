// import interval from './interval'
// import {
//   isFunction,
//   isNumber
// } from '../utility'


// const USAGE = 'Usage: chunkify.range(Function fn, Number range, [Object options])';

// let checkUsage = (fn, range) => {
//   if (!isFunction(fn)) {
//     throw new Error(`${USAGE} - bad fn; not a function`);
//   } else if (!isNumber(range)) {
//     throw new Error(`${USAGE} - bad range; not a number`);
//   }
// };

// let range = (fn, range, options = {}) => {
//   checkUsage(fn, range);
//   delete options.start;
//   return interval(fn, range, options);
// };

// export default range