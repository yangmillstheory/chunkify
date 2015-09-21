import test from 'tape'
import chunkify from './index'
import {ChunkifyOptions_spy, tick} from './testutils'
import ChunkifyOptions from '../options'
import sinon from 'sinon'
import _ from 'underscore'


test('should require an array', t => {
  t.throws(() => {
    chunkify.each()
  }, /Usage: chunkify.each\(Array array, Function fn, \[Object options]\) - bad array/);
  t.end()
});

test('should require a function', t => {
  t.throws(() => {
    chunkify.each([])
  }, /Usage: chunkify.each\(Array array, Function fn, \[Object options]\) - bad fn/);
  t.end()
});

test('should delegate options deserialization', t => {
  ChunkifyOptions_spy((spy) => {
    let options = {};
    chunkify.each([], function() {}, options);
    t.ok(spy.calledWith(options));
    t.end()
  });
});

test('should default options to an empty object', t => {
  ChunkifyOptions_spy((spy) => {
    chunkify.each([], function() {});
    t.ok(spy.calledWith({}));
    t.end()
  });
});

test('should return a promise and not block the main thread', t => {
  let array = ['A'];
  let fn = sinon.spy();
  let fn_on_main_thread = sinon.spy();
  let promise = chunkify.each(array, fn);

  fn_on_main_thread();

  t.ok(fn_on_main_thread.called);
  t.ok(promise instanceof Promise);
  t.end()
});

test('should not invoke fn when given an empty array', t => {
  let fn = sinon.spy();

  chunkify.each([], fn).then(() => {
    t.notOk(fn.called);
    t.end();
  });
});

test('should invoke fn on the array between 0 and `chunk` iterations', t => {
  let array = ['A', 'B', 'C'];
  let fn = sinon.spy();
  let chunk = 3;

  chunkify.each(array, fn, {chunk}).then(() => {
    t.equals(fn.callCount, 3);
    t.deepEqual(fn.getCall(0).args, ['A']);
    t.deepEqual(fn.getCall(1).args, ['B']);
    t.deepEqual(fn.getCall(2).args, ['C']);
    t.end()
  })
});

test('should yield to the main thread for at least `delay` ms after `chunk` iterations', t => {
  let array = ['A', 'B', 'C', 'D'];
  let fn = sinon.spy();

  tick({
    delay: 999,

    before_tick() {
      chunkify.each(array, fn, {chunk: 3, delay: 1000});

      t.equals(fn.callCount, 3);
      t.deepEqual(fn.getCall(0).args, ['A']);
      t.deepEqual(fn.getCall(1).args, ['B']);
      t.deepEqual(fn.getCall(2).args, ['C']);
    },

    after_tick() {
      // 1000 milliseconds hasn't elapsed yet
      t.equals(fn.callCount, 3);
      t.end();
    }
  });
});

test('should start again in `delay` milliseconds after yielding', t => {
  let array = ['A', 'B', 'C', 'D'];
  let fn = sinon.spy();

  tick({
    delay: 1000,

    before_tick() {
      chunkify.each(array, fn, {chunk: 3, delay: 1000});
      t.equals(fn.callCount, 3);
      t.deepEqual(fn.getCall(0).args, ['A']);
      t.deepEqual(fn.getCall(1).args, ['B']);
      t.deepEqual(fn.getCall(2).args, ['C']);
    },

    after_tick() {
      t.equals(fn.callCount, 4);
      t.deepEqual(fn.getCall(3).args, ['D']);
      t.end();
    }
  });
});

test('should resolve with undefined after processing completes', t => {
  let array = ['A', 'B', 'C', 'D'];
  let fn = sinon.spy();

  tick({
    delay: 1000,

    before_tick() {
      return chunkify.each(array, fn, {chunk: 3, delay: 1000});
    },

    after_tick(chunkify_promise) {
      chunkify_promise.then((result) => {
        t.equals(result, undefined);
        t.end()
      })
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

  chunkify.each(array, fn, {chunk: 3}).then(null, (rejection) => {
    t.equals(rejection.item, 'B');
    t.equals(rejection.error, error);

    t.equals(fn.callCount, 2);
    t.deepEquals(fn.getCall(0).args, ['A']);
    t.deepEquals(fn.getCall(1).args, ['B']);

    t.end()
  })
});

test('should not yield after `chunk` iterations if processing is complete', t => {
  let array = ['A', 'B', 'C'];
  let fn = sinon.spy();

  tick({
    delay: 2000,

    before_tick() {
      chunkify.each(array, fn, {chunk: 3, delay: 1000});
      t.equals(fn.callCount, 3)
    },

    after_tick() {
      t.equals(fn.callCount, 3);
      t.end()
    }
  });
});