import test from 'tape'
import sinon from 'sinon'
import _ from 'underscore'

import chunkify from './index'
import {ChunkifyOptionsSpy, tick} from './testutils'
import ChunkifyOptions from './options'


test('should require a range', t => {
  t.throws(() => {
    chunkify.loop()
  }, /Usage: chunkify.loop\(Number range, Function fn, \[Object options]\) - bad range/);
  t.end()
});

test('should require a function', t => {
  t.throws(() => {
    chunkify.loop(10)
  }, /Usage: chunkify.loop\(Number range, Function fn, \[Object options]\) - bad fn/);
  t.end()
});

test('should deserialize options', t => {
  ChunkifyOptionsSpy((spy) => {
    let options = {};
    chunkify.loop(10, sinon.spy(), options);
    t.ok(spy.calledWith(options));
    t.end()
  });
});

test('should default options to an empty object', t => {
  ChunkifyOptionsSpy((spy) => {
    chunkify.loop(10, sinon.spy());
    t.ok(spy.calledWith({}));
    t.end()
  });
});

test('should return a promise', t => {
  t.ok(chunkify.loop(10, sinon.spy()) instanceof Promise);
  t.end()
});

test('should not invoke fn when range is 0', t => {
  let fn = sinon.spy();

  chunkify.loop(0, fn).then(() => {
    t.notOk(fn.called);
    t.end();
  });
});

test('should invoke fn with the loop index', t => {
  let fn = sinon.spy();

  chunkify.loop(3, fn, {chunk: 3}).then(() => {
    t.equals(fn.callCount, 3);
    t.deepEqual(fn.getCall(0).args, [0]);
    t.deepEqual(fn.getCall(1).args, [1]);
    t.deepEqual(fn.getCall(2).args, [2]);
    t.end()
  })
});

test('should invoke fn with the default scope', t => {
  let fn = sinon.spy();

  chunkify.loop(3, fn, {chunk: 3}).then(() => {
    t.ok(fn.alwaysCalledOn(null));
    t.end()
  });
});

test('should invoke fn with the provided scope', t => {
  let fn = sinon.spy();
  let scope = {};

  chunkify.loop(3, fn, {chunk: 3, scope}).then(() => {
    t.ok(fn.alwaysCalledOn(scope));
    t.end()
  });
});

test('should yield for at least `delay` ms after `chunk` iterations', t => {
  let fn = sinon.spy();

  tick({
    delay: 999,

    before_tick() {
      chunkify.loop(4, fn, {chunk: 3, delay: 1000});
      t.equals(fn.callCount, 3);
    },

    after_tick() {
      // 1000 milliseconds hasn't elapsed yet
      t.equals(fn.callCount, 3);
      t.end();
    }
  });
});

test('should start again in `delay` milliseconds after yielding', t => {
  let fn = sinon.spy();

  tick({
    delay: 1000,

    before_tick() {
      chunkify.loop(4, fn, {chunk: 3, delay: 1000});
      t.equals(fn.callCount, 3);
    },

    after_tick() {
      t.equals(fn.callCount, 4);
      t.end();
    }
  });
});

test('should resolve with undefined', t => {
  let fn = sinon.spy();

  tick({
    delay: 1000,

    before_tick() {
      let promise = chunkify.loop(4, fn, {chunk: 3, delay: 1000});
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
  let fn = sinon.spy((index) => {
    if (index === 1) {
      throw error;
    }
  });

  chunkify.loop(3, fn, {chunk: 3}).then(null, (rejection) => {
    t.deepEquals(rejection, {error, index: 1});
    t.equals(fn.callCount, 2);
    t.end()
  })
});

test('should not yield after `chunk` iterations if processing is complete', t => {
  let fn = sinon.spy();

  tick({
    delay: 2000,

    before_tick() {
      chunkify.loop(3, fn, {chunk: 3, delay: 1000});
      t.equals(fn.callCount, 3)
    },

    after_tick() {
      t.equals(fn.callCount, 3);
      t.end()
    }
  });
});