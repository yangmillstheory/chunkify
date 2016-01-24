import {expect} from 'chai';
import {spy} from 'sinon';
import {interval} from './interval';
import {tick} from '../test-utility';
import {parseOptions} from '../options';


describe('interval', () => {

  it('should require a function', () => {
    for (let thing of [1, 'string', {}, [], null, undefined]) {
      expect(() => { interval(); }).throws(/Expected function; got /);
    }
  });

});


// test('should require a final index', () => {
//   t.throws(() => {
//     chunkify.interval(() => {})
//   }, /Usage: chunkify.interval\(Function fn, Number final, \[Object options]\) - bad final; not a number/);
//   t.end()
// });

// test('should require a number start option if given', () => {
//   t.throws(() => {
//     chunkify.interval(() => {}, 10, {start: 'string'})
//   }, /Usage: chunkify.interval\(Function fn, Number final, \[Object options]\) - bad start; not a number/);
//   t.end()
// });

// test('should require a number start option less than final if given', () => {
//   t.throws(() => {
//     chunkify.interval(() => {}, 10, {start: 11})
//   }, /Usage: chunkify.interval\(Function fn, Number final, \[Object options]\) - bad start; it's greater than final/);
//   t.end()
// });

// test('should deserialize options', () => {
//   ChunkifyOptionsSpy((spy) => {
//     let options = {};
//     chunkify.interval(sinon.spy(), 10, options);
//     t.ok(spy.calledWith(options));
//     t.end()
//   });
// });

// test('should default options to an empty object', () => {
//   ChunkifyOptionsSpy((spy) => {
//     chunkify.interval(sinon.spy(), 10);
//     t.ok(spy.calledWith({}));
//     t.end()
//   });
// });

// test('should return a promise', () => {
//   t.ok(chunkify.interval(sinon.spy(), 10) instanceof Promise);
//   t.end()
// });

// test('should not invoke fn when range is 0', () => {
//   let fn = sinon.spy();

//   chunkify.interval(fn, 0).then(() => {
//     t.notOk(fn.called);
//     t.end();
//   });
// });

// test('should invoke fn with the default scope', () => {
//   let fn = sinon.spy();

//   chunkify.interval(fn, 3, {start: 1, chunk: 3}).then(() => {
//     t.ok(fn.alwaysCalledOn(null));
//     t.end()
//   });
// });

// test('should invoke fn with the provided scope', () => {
//   let fn = sinon.spy();
//   let scope = {};

//   chunkify.interval(fn, 3, {start: 1, chunk: 3, scope}).then(() => {
//     t.ok(fn.alwaysCalledOn(scope));
//     t.end()
//   });
// });

// test('should invoke fn with the correct loop index', () => {
//   let fn = sinon.spy();

//   chunkify.interval(fn, 4, {start: 1, chunk: 3}).then(() => {
//     t.equals(fn.callCount, 3);
//     t.deepEqual(fn.getCall(0).args, [1]);
//     t.deepEqual(fn.getCall(1).args, [2]);
//     t.deepEqual(fn.getCall(2).args, [3]);
//     t.end()
//   })
// });

// test('should yield for at least `delay` ms after `chunk` iterations', () => {
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

// test('should start again after `delay` milliseconds from last yielding', () => {
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

// test('should resolve with undefined', () => {
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

// test('should reject the promise with rejection object and stop processing', () => {
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

// test('should not yield after `chunk` iterations if processing is complete', () => {
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