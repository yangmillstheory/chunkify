// import test from 'tape'
// import sinon from 'sinon'
// import chunkify from '../index'
// import {ChunkifyOptionsSpy, tick} from '../testutils'
// import ChunkifyOptions from '../options'


// test('should require a function', t => {
//   t.throws(() => {
//     chunkify.range()
//   }, /Usage: chunkify.range\(Function fn, Number range, \[Object options]\) - bad fn/);
//   t.end()
// });

// test('should require a function', t => {
//   t.throws(() => {
//     chunkify.range(() => {})
//   }, /Usage: chunkify.range\(Function fn, Number range, \[Object options]\) - bad range/);
//   t.end()
// });

// test('should deserialize options', t => {
//   ChunkifyOptionsSpy((spy) => {
//     let options = {};
//     chunkify.range(sinon.spy(), 10, options);
//     t.ok(spy.calledWith(options));
//     t.end()
//   });
// });

// test('should default options to an empty object', t => {
//   ChunkifyOptionsSpy((spy) => {
//     chunkify.range(sinon.spy(), 10);
//     t.ok(spy.calledWith({}));
//     t.end()
//   });
// });

// test('should remove any start value in options', t => {
//   ChunkifyOptionsSpy((spy) => {
//     chunkify.range(sinon.spy(), 10, {start: 5});
//     t.ok(spy.calledWith({}));
//     t.end()
//   });
// });

// test('should return a promise', t => {
//   t.ok(chunkify.range(sinon.spy(), 10) instanceof Promise);
//   t.end()
// });

// test('should not invoke fn when range is 0', t => {
//   let fn = sinon.spy();

//   chunkify.range(fn, 0).then(() => {
//     t.notOk(fn.called);
//     t.end();
//   });
// });

// test('should invoke fn with the loop index', t => {
//   let fn = sinon.spy();

//   chunkify.range(fn, 3, {chunk: 3}).then(() => {
//     t.equals(fn.callCount, 3);
//     t.deepEqual(fn.getCall(0).args, [0]);
//     t.deepEqual(fn.getCall(1).args, [1]);
//     t.deepEqual(fn.getCall(2).args, [2]);
//     t.end()
//   })
// });

// test('should invoke fn with the default scope', t => {
//   let fn = sinon.spy();

//   chunkify.range(fn, 3, {chunk: 3}).then(() => {
//     t.ok(fn.alwaysCalledOn(null));
//     t.end()
//   });
// });

// test('should invoke fn with the provided scope', t => {
//   let fn = sinon.spy();
//   let scope = {};

//   chunkify.range(fn, 3, {chunk: 3, scope}).then(() => {
//     t.ok(fn.alwaysCalledOn(scope));
//     t.end()
//   });
// });

// test('should yield for at least `delay` ms after `chunk` iterations', t => {
//   let fn = sinon.spy();

//   tick({
//     delay: 9,

//     beforeTick() {
//       chunkify.range(fn, 4, {chunk: 3, delay: 10});
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
//       chunkify.range(fn, 4, {chunk: 3, delay: 10});
//       t.equals(fn.callCount, 3);
//     },

//     afterTick() {
//       t.equals(fn.callCount, 4);
//       t.end();
//     }
//   });
// });

// test('should resolve with undefined', t => {
//   let fn = sinon.spy();

//   tick({
//     delay: 11,

//     beforeTick() {
//       let promise = chunkify.range(fn, 4, {chunk: 3, delay: 10});
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
//     if (index === 1) {
//       throw error;
//     }
//   });

//   chunkify.range(fn, 3, {chunk: 3}).then(null, (rejection) => {
//     t.deepEquals(rejection, {error, index: 1});
//     t.equals(fn.callCount, 2);
//     t.end()
//   })
// });

// test('should not yield after `chunk` iterations if processing is complete', t => {
//   let fn = sinon.spy();

//   tick({
//     delay: 20,

//     beforeTick() {
//       chunkify.range(fn, 3, {chunk: 3, delay: 10});
//       t.equals(fn.callCount, 3)
//     },

//     afterTick() {
//       t.equals(fn.callCount, 3);
//       t.end()
//     }
//   });
// });