import sinon from 'sinon'
import _ from 'underscore'
import test from 'tape'

import chunkify from '../index'
import ChunkifyOptions from '../options'
import each from './each'
import {tick} from '../testutils'
import {each_spy} from './testutils'


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
test('should delegate array, parsed options, and a wrapped fn to .each', t => {
  let array = ['A', 'B', 'C'];
  let scope = {};
  let options = ChunkifyOptions.of({chunk: 3, scope});
  let fn = sinon.spy();

  each_spy((each) => {
    chunkify.map(array, fn, options);

    // fn was called 3 times
    t.ok(fn.callCount, 3);
    t.ok(fn.alwaysCalledOn(scope));

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
      t.ok(fn.alwaysCalledOn(null));
      return promise;
    },

    after_tick(promise) {
      t.equals(fn.callCount, 3);
      t.ok(fn.alwaysCalledOn(null));
      promise.then((mapped) => {
        t.deepEquals(mapped, ['a', 'b', 'c']);
        t.end()
      });
    }
  });
});

test('should reject the promise with rejection object and stop processing', t => {
  let array = ['A', 'B', 'C'];
  let error = new Error('Cannot process B!');
  let fn = sinon.spy((letter) => {
    if (letter === 'B') {
      throw error;
    }
  });

  chunkify.map(array, fn, {chunk: 3}).then(null, (rejection) => {
    t.equals(rejection.item, 'B');
    t.equals(rejection.error, error);

    t.equals(fn.callCount, 2);
    t.deepEquals(fn.getCall(0).args, ['A', 0]);
    t.deepEquals(fn.getCall(1).args, ['B', 1]);

    t.end()
  })
});