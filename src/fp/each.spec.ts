import {spy, stub} from 'sinon';
import {expect} from 'chai';
import {each} from './each';
import {tick} from '../test-utility';
import proxyquire from 'proxyquire';


describe('each', () => {

  it('should require an array', () => {
    expect(() => { each(); }).throws(/Expected array, got/);
  });

  it('should require a function', () => {
    expect(() => { each([1, 2, 3]); }).throws(/Expected function, got/);
  });

  it('should delegate array length and options to range', () => {
    let range = stub().returns({
      catch: stub()
    });
    let {each} = proxyquire('./each', {
      '../iter/range': {range}
    });

    let array = [1, 2, 3];
    let indexConsumer = stub();
    let options = {};
    each(array, indexConsumer, options);

    expect(range.calledOnce).to.be.ok;
    expect(range.lastCall.args[1]).to.equal(array.length);
    expect(range.lastCall.args[2]).to.equal(options);
  });

// test('should not invoke fn when given an empty array', () => {
//   let fn = sinon.spy();

//   each([], fn).then(() => {
//     t.notOk(fn.called);
//     t.end();
//   });
// });

// test('should invoke fn with the default scope', () => {
//   let fn = sinon.spy();

//   each(['A', 'B', 'C'], fn, {chunk: 3}).then(() => {
//     t.ok(fn.alwaysCalledOn(null));
//     t.end()
//   });
// });

// test('should invoke fn with the provided scope', () => {
//   let fn = sinon.spy();
//   let scope = {};

//   each(['A', 'B', 'C'], fn, {chunk: 3, scope}).then(() => {
//     t.ok(fn.alwaysCalledOn(scope));
//     t.end()
//   });
// });

// test('should invoke fn with the array item and index', () => {
//   let fn = sinon.spy();

//   each(['A', 'B', 'C'], fn, {chunk: 3}).then(() => {
//     t.equals(fn.callCount, 3);
//     t.deepEqual(fn.getCall(0).args, ['A', 0]);
//     t.deepEqual(fn.getCall(1).args, ['B', 1]);
//     t.deepEqual(fn.getCall(2).args, ['C', 2]);
//     t.end()
//   })
// });

// test('should yield for at least `delay` ms after `chunk` iterations', () => {
//   let fn = sinon.spy();

//   tick({
//     delay: 9,

//     beforeTick() {
//       each(['A', 'B', 'C', 'D'], fn, {chunk: 3, delay: 10});
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
//       each(['A', 'B', 'C', 'D'], fn, {chunk: 3, delay: 10});
//       t.equals(fn.callCount, 3);
//     },

//     afterTick() {
//       t.equals(fn.callCount, 4);
//       t.deepEqual(fn.getCall(3).args, ['D', 3]);
//       t.end();
//     }
//   });
// });

// test('should resolve with undefined', () => {
//   let fn = sinon.spy();

//   tick({
//     delay: 11,

//     beforeTick() {
//       let promise = each(['A', 'B', 'C', 'D'], fn, {chunk: 3, delay: 10});
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

// test('should reject the promise with the index, error, and item, and stop processing', () => {
//   let error = {};
//   let fn = sinon.spy((letter) => {
//     if (letter === 'B') {
//       throw error;
//     }
//   });

//   each(['A', 'B', 'C'], fn, {chunk: 3}).then(null, (rejection) => {
//     t.deepEquals(rejection, {error, item: 'B', index: 1});
//     t.equals(fn.callCount, 2);
//     t.end()
//   })
// });

// test('should not yield after `chunk` iterations if processing is complete', () => {
//   let fn = sinon.spy();

//   tick({
//     delay: 20,

//     beforeTick() {
//       each(['A', 'B', 'C'], fn, {chunk: 3, delay: 10});
//       t.equals(fn.callCount, 3)
//     },

//     afterTick() {
//       t.equals(fn.callCount, 3);
//       t.end()
//     }
//   });
// });

});
