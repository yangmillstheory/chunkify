// import each from './each'
// import {checkUsage} from './utility'


// const USAGE = 'Usage: chunkify.reduce(Array array, Function fn, [Object options])';
// const MEMO_KEY = 'memo';

// let reduce = (array, fn, options = {}) => {
//   checkUsage(array, fn, USAGE);
//   let initialize = () => {
//     if (options.hasOwnProperty(MEMO_KEY)) {
//       return {skipFirst: false, memo: options[MEMO_KEY]}
//     } else {
//       return {skipFirst: true, memo: array[0]}
//     }
//   };
//   let {memo, skipFirst} = initialize();
//   let reducee = function(item, index) {
//     if (skipFirst && index === 0) {
//       return
//     }
//     // this will be scoped to options.scope
//     memo = fn.call(this, memo, item, index, array);
//   };
//   return each(array, reducee, options).then(() => {
//     return memo
//   });
// };


// export default reduce