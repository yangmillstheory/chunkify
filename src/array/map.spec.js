import sinon from 'sinon'
import _ from 'underscore'
import test from 'tape'

import chunkify from '../index'
import each from './each'
import {tick} from '../testutils'


let each_spy = (callback) => {
  callback(sinon.spy(each, 'apply'));
  each.apply.restore()
};

test('should require an array', t => {
  t.throws(() => {
    chunkify.map()
  }, /Usage: chunkify.map\(Array array, Function fn, \[Object options]\) - bad array/);
  t.end()
});

test('should require a function', t => {
  t.throws(() => {
    chunkify.map([])
  }, /Usage: chunkify.map\(Array array, Function fn, \[Object options]\) - bad fn/);
  t.end()
});

test('should return a promise', t => {
  t.ok(chunkify.map(['A', 'B', 'C'], () => {}) instanceof Promise);
  t.end()
});

// thus, cf. ./each.spec.js
test('should delegate array, options, and a wrapped fn to .each', t => {
  let array = ['A', 'B', 'C'];
  let options = {chunk: 3};
  let fn = sinon.spy();

  each_spy((each) => {
    chunkify.map(array, fn, options);

    // fn was called 3 times
    t.ok(fn.callCount, 3);

    // use a function matcher, since fn was wrapped (we don't care how)
    t.ok(each.calledWithExactly(array, sinon.match.func, options));
    t.ok(each.callCount, 1);
    t.end();
  });
});

test('should resolve with mapped results', t => {
  let array = ['A', 'B', 'C'];
  let options = {chunk: 2, delay: 1000};
  let fn = sinon.spy((letter) => {
    return letter.toLowerCase();
  });

  tick({
    delay: 1000,

    before_tick() {
      let promise = chunkify.map(array, fn, options);
      t.equals(fn.callCount, 2);
      return promise;
    },

    after_tick(promise) {
      t.equals(fn.callCount, 3);
      promise.then((mapped) => {
        t.deepEquals(mapped, ['a', 'b', 'c']);
        t.end()
      });
    }
  });
});