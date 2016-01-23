// import test from 'tape'
// import sinon from 'sinon'
// import chunkify from '../index'
// import {ChunkifyOptionsSpy, tick} from '../testutils'
// import ChunkifyOptions from '../options'


// test('should require a function', t => {
//   t.throws(() => {
//     chunkify.interval()
//   }, /Usage: chunkify.interval\(Function fn, Number final, \[Object options]\) - bad fn; not a function/);
//   t.end()
// });

// test('should require a final index', t => {
//   t.throws(() => {
//     chunkify.interval(() => {})
//   }, /Usage: chunkify.interval\(Function fn, Number final, \[Object options]\) - bad final; not a number/);
//   t.end()
// });

// test('should require a number start option if given', t => {
//   t.throws(() => {
//     chunkify.interval(() => {}, 10, {start: 'string'})
//   }, /Usage: chunkify.interval\(Function fn, Number final, \[Object options]\) - bad start; not a number/);
//   t.end()
// });

// test('should require a number start option less than final if given', t => {
//   t.throws(() => {
//     chunkify.interval(() => {}, 10, {start: 11})
//   }, /Usage: chunkify.interval\(Function fn, Number final, \[Object options]\) - bad start; it's greater than final/);
//   t.end()
// });

// test('should deserialize options', t => {
//   ChunkifyOptionsSpy((spy) => {
//     let options = {};
//     chunkify.interval(sinon.spy(), 10, options);
//     t.ok(spy.calledWith(options));
//     t.end()
//   });
// });

// test('should default options to an empty object', t => {
//   ChunkifyOptionsSpy((spy) => {
//     chunkify.interval(sinon.spy(), 10);
//     t.ok(spy.calledWith({}));
//     t.end()
//   });
// });

// test('should return a promise', t => {
//   t.ok(chunkify.interval(sinon.spy(), 10) instanceof Promise);
//   t.end()
// });

// test('should not invoke fn when range is 0', t => {
//   let fn = sinon.spy();

//   chunkify.interval(fn, 0).then(() => {
//     t.notOk(fn.called);
//     t.end();
//   });
// });

// test('should invoke fn with the default scope', t => {
//   let fn = sinon.spy();

//   chunkify.interval(fn, 3, {start: 1, chunk: 3}).then(() => {
//     t.ok(fn.alwaysCalledOn(null));
//     t.end()
//   });
// });

// test('should invoke fn with the provided scope', t => {
//   let fn = sinon.spy();
//   let scope = {};

//   chunkify.interval(fn, 3, {start: 1, chunk: 3, scope}).then(() => {
//     t.ok(fn.alwaysCalledOn(scope));
//     t.end()
//   });
// });

// test('should invoke fn with the correct loop index', t => {
//   let fn = sinon.spy();

//   chunkify.interval(fn, 4, {start: 1, chunk: 3}).then(() => {
//     t.equals(fn.callCount, 3);
//     t.deepEqual(fn.getCall(0).args, [1]);
//     t.deepEqual(fn.getCall(1).args, [2]);
//     t.deepEqual(fn.getCall(2).args, [3]);
//     t.end()
//   })
// });

// test('should yield for at least `delay` ms after `chunk` iterations', t => {
//   let fn = sinon.spy();

//   tick({
//     delay: 9,

//     beforeTick() {
//       chunkify.interval(fn, 5, {start: 1, chunk: 3, delay: 10});
//       t.equals(fn.callCount, 3);
//     },

//     afterTick() {
//       t.equals(fn.callCount, 3);
//       t.end();
//     }
//   });
// });

// test('should start again after `delay` milliseconds from last yielding', t => {
//   let fn = sinon.spy();

//   tick({
//     delay: 11,

//     beforeTick() {
//       chunkify.interval(fn, 5, {start: 1, chunk: 3, delay: 10});
//       t.equals(fn.callCount, 3);
//     },

//     afterTick() {
//       t.equals(fn.callCount, 4);
//       t.deepEquals(fn.lastCall.args, [4]);
//       t.end();
//     }
//   });
// });

// test('should resolve with undefined', t => {
//   let fn = sinon.spy();

//   tick({
//     delay: 11,

//     beforeTick() {
//       let promise = chunkify.interval(fn, 5, {start: 1, chunk: 3, delay: 10});
//       t.equals(fn.callCount, 3);
//       return promise
//     },

//     afterTick(promise) {
//       t.equals(fn.callCount, 4);
//       promise.then((result) => {
//         t.equals(result, undefined);
//         t.end()
//       })
//     }
//   });
// });

// test('should reject the promise with rejection object and stop processing', t => {
//   let error = {};
//   let fn = sinon.spy((index) => {
//     if (index === 2) {
//       throw error;
//     }
//   });

//   chunkify.interval(fn, 5, {start: 1, chunk: 3}).then(null, (rejection) => {
//     t.deepEquals(rejection, {error, index: 2});
//     t.equals(fn.callCount, 2);
//     t.end()
//   })
// });

// test('should not yield after `chunk` iterations if processing is complete', t => {
//   let fn = sinon.spy();

//   tick({
//     delay: 20,

//     beforeTick() {
//       chunkify.interval(fn, 4, {start: 1, chunk: 3, delay: 10});
//       t.equals(fn.callCount, 3)
//     },

//     afterTick() {
//       t.equals(fn.callCount, 3);
//       t.end()
//     }
//   });
// });