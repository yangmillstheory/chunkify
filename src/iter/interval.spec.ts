import {expect} from 'chai';
import {spy} from 'sinon';
import {interval} from './interval';
import {tick} from '../test-utility';
import {parseOptions} from '../options';


describe('interval', () => {

  it('should require a function', () => {
    for (let fn of [
      1,
      'string',
      {},
      [],
      null,
      undefined,
    ]) {
      expect(() => { interval(fn); }).throws(/Expected function; got /);
    }
  });

  it('should require a number start index', () => {
    for (let start of [
      function() {},
      'string',
      {},
      [],
      null,
      undefined,
    ]) {
      expect(() => { interval(spy(), start); }).throws(/Expected number; got /);
    }
  });

  it('should require a number final index', () => {
    for (let final of [
      function() {},
      'string',
      {},
      [],
      null,
      undefined
    ]) {
      expect(() => { interval(spy(), 0, final); }).throws(/Expected number; got /);
    }
  });

  it('should require start to be less than final', () => {
    expect(() => { interval(spy(), 1, 0); }).throws(/Expected start 1 to be less than final 0/);
    expect(() => { interval(spy(), 0, 0); }).throws(/Expected start 0 to be less than final 0/);
  });

  it('should return a promise', () => {
    expect(interval(() => {}, 0, 1)).to.be.instanceOf(Promise);
  });

  it('should invoke fn with a default scope', done => {
    let fn = spy();

    interval(fn, 0, 3, {chunk: 3})
      .then(() => {
        expect(fn.alwaysCalledOn(null)).to.be.ok;
        done();
      })
      .catch(done);
  });

  it('should invoke fn with a provided scope', done => {
    let fn = spy();
    let scope = spy();

    interval(fn, 0, 3, {chunk: 3, scope})
      .then(() => {
        expect(fn.alwaysCalledOn(scope)).to.be.ok;
        done();
      })
      .catch(done);
  });

});




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
