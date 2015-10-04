import test from 'tape'
import sinon from 'sinon'
import _ from 'underscore'

import chunkify from '../index'
import {ChunkifyOptionsSpy, tick} from '../testutils'
import ChunkifyOptions from '../options'


test('should require an array', t => {
  t.throws(() => {
    chunkify.each()
  }, /Usage: chunkify.each\(Array array, Function fn, \[Object options]\) - bad array; not an array/);
  t.end()
});

test('should require a function', t => {
  t.throws(() => {
    chunkify.each([])
  }, /Usage: chunkify.each\(Array array, Function fn, \[Object options]\) - bad fn; not a function/);
  t.end()
});

test('should deserialize options', t => {
  ChunkifyOptionsSpy((spy) => {
    let options = {};
    chunkify.each([], sinon.spy(), options);
    t.ok(spy.calledWith(options));
    t.end()
  });
});

test('should default options to an empty object', t => {
  ChunkifyOptionsSpy((spy) => {
    chunkify.each([], sinon.spy());
    t.ok(spy.calledWith({}));
    t.end()
  });
});

test('should return a promise', t => {
  t.ok(chunkify.each([], sinon.spy()) instanceof Promise);
  t.end()
});

test('should not invoke fn when given an empty array', t => {
  let fn = sinon.spy();

  chunkify.each([], fn).then(() => {
    t.notOk(fn.called);
    t.end();
  });
});

test('should invoke fn with the default scope', t => {
  let fn = sinon.spy();

  chunkify.each(['A', 'B', 'C'], fn, {chunk: 3}).then(() => {
    t.ok(fn.alwaysCalledOn(null));
    t.end()
  });
});

test('should invoke fn with the provided scope', t => {
  let fn = sinon.spy();
  let scope = {};

  chunkify.each(['A', 'B', 'C'], fn, {chunk: 3, scope}).then(() => {
    t.ok(fn.alwaysCalledOn(scope));
    t.end()
  });
});

test('should invoke fn with the array item and index', t => {
  let fn = sinon.spy();

  chunkify.each(['A', 'B', 'C'], fn, {chunk: 3}).then(() => {
    t.equals(fn.callCount, 3);
    t.deepEqual(fn.getCall(0).args, ['A', 0]);
    t.deepEqual(fn.getCall(1).args, ['B', 1]);
    t.deepEqual(fn.getCall(2).args, ['C', 2]);
    t.end()
  })
});

test('should yield for at least `delay` ms after `chunk` iterations', t => {
  let fn = sinon.spy();

  tick({
    delay: 10,

    before_tick() {
      chunkify.each(['A', 'B', 'C', 'D'], fn, {chunk: 3, delay: 10});
      t.equals(fn.callCount, 3);
    },

    after_tick() {
      t.equals(fn.callCount, 3);
      t.end();
    }
  });
});

test('should start again after `delay` milliseconds from last yielding', t => {
  let fn = sinon.spy();

  tick({
    delay: 11,

    before_tick() {
      chunkify.each(['A', 'B', 'C', 'D'], fn, {chunk: 3, delay: 10});
      t.equals(fn.callCount, 3);
    },

    after_tick() {
      t.equals(fn.callCount, 4);
      t.deepEqual(fn.getCall(3).args, ['D', 3]);
      t.end();
    }
  });
});

test('should resolve with undefined', t => {
  let fn = sinon.spy();

  tick({
    delay: 11,

    before_tick() {
      let promise = chunkify.each(['A', 'B', 'C', 'D'], fn, {chunk: 3, delay: 10});
      t.equals(fn.callCount, 3);
      return promise
    },

    after_tick(promise) {
      t.equals(fn.callCount, 4);
      promise.then((result) => {
        t.equals(result, undefined);
        t.end()
      })
    }
  });
});

test('should reject the promise with rejection object and stop processing', t => {
  let error = {};
  let fn = sinon.spy((letter) => {
    if (letter === 'B') {
      throw error;
    }
  });

  chunkify.each(['A', 'B', 'C'], fn, {chunk: 3}).then(null, (rejection) => {
    t.deepEquals(rejection, {error, item: 'B', index: 1});
    t.equals(fn.callCount, 2);
    t.end()
  })
});

test('should not yield after `chunk` iterations if processing is complete', t => {
  let fn = sinon.spy();

  tick({
    delay: 20,

    before_tick() {
      chunkify.each(['A', 'B', 'C'], fn, {chunk: 3, delay: 10});
      t.equals(fn.callCount, 3)
    },

    after_tick() {
      t.equals(fn.callCount, 3);
      t.end()
    }
  });
});