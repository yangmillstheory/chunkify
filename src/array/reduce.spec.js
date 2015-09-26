import test from 'tape'
import sinon from 'sinon'
import _ from 'underscore'

import chunkify from '../index'
import {ChunkifyOptionsSpy, tick} from '../testutils'
import ChunkifyOptions from '../options'


test('should require an array', t => {
  t.throws(() => {
    chunkify.reduce()
  }, /Usage: chunkify.reduce\(Array array, Function fn, \[Object options]\) - bad array/);
  t.end()
});

test('should require a function', t => {
  t.throws(() => {
    chunkify.reduce([])
  }, /Usage: chunkify.reduce\(Array array, Function fn, \[Object options]\) - bad fn/);
  t.end()
});

test('should deserialize options', t => {
  ChunkifyOptionsSpy((spy) => {
    let options = {};
    chunkify.reduce([], sinon.spy(), options);
    t.ok(spy.calledWith(options));
    t.end()
  });
});

test('should default options to an empty object', t => {
  ChunkifyOptionsSpy((spy) => {
    chunkify.reduce([], sinon.spy());
    t.ok(spy.calledWith({}));
    t.end()
  });
});

test('should return a promise', t => {
  t.ok(chunkify.reduce([], sinon.spy()) instanceof Promise);
  t.end()
});

test('should not invoke fn when given an empty array', t => {
  let fn = sinon.spy();

  chunkify.reduce([], fn).then(() => {
    t.notOk(fn.called);
    t.end();
  });
});

test('should invoke fn with memo, item, index and array between 0 and `chunk` iterations', t => {
  let array = ['A', 'B', 'C'];
  let identity = sinon.spy((memo) => {
    return memo;
  });

  chunkify.reduce(array, identity, {chunk: 3, memo: 'MEMO'}).then(() => {
    t.equals(identity.callCount, 3);
    t.deepEqual(identity.getCall(0).args, ['MEMO', 'A', 0, array]);
    t.deepEqual(identity.getCall(1).args, ['MEMO', 'B', 1, array]);
    t.deepEqual(identity.getCall(2).args, ['MEMO', 'C', 2, array]);
    t.end()
  })
});

test('should invoke fn with the memo as the first item when no memo is given', t => {
  let array = ['A', 'B', 'C'];
  let identity = sinon.spy((memo) => {
    return memo;
  });

  chunkify.reduce(array, identity, {chunk: 2}).then(() => {
    // Note the reduced call count!
    t.equals(identity.callCount, 2);
    t.deepEqual(identity.getCall(0).args, ['A', 'B', 1, array]);
    t.deepEqual(identity.getCall(1).args, ['A', 'C', 2, array]);
    t.end()
  })
});

test('should invoke fn with the default scope', t => {
  let fn = sinon.spy();

  chunkify.reduce(['A', 'B', 'C'], fn, {chunk: 3}).then(() => {
    t.ok(fn.alwaysCalledOn(null));
    t.end()
  });
});

test('should invoke fn with the provided scope', t => {
  let fn = sinon.spy();
  let scope = {};

  chunkify.reduce(['A', 'B', 'C'], fn, {chunk: 3, scope}).then(() => {
    t.ok(fn.alwaysCalledOn(scope));
    t.end()
  });
});

test('should yield for at least `delay` ms after `chunk` iterations', t => {
  let fn = sinon.spy();

  tick({
    delay: 999,

    before_tick() {
      chunkify.reduce(['A', 'B', 'C', 'D'], fn, {memo: '', chunk: 3, delay: 1000});
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
      chunkify.reduce(['A', 'B', 'C', 'D'], fn, {memo: '', chunk: 3, delay: 1000});
      t.equals(fn.callCount, 3);
    },

    after_tick() {
      t.equals(fn.callCount, 4);
      t.end();
    }
  });
});

test('should resolve with the reduced result from a default memo', t => {
  let fn = sinon.spy((memo, letter, index, array) => {
    return `${memo.toLowerCase()}+${letter.toLowerCase()}`
  });

  tick({
    delay: 1000,

    before_tick() {
      let promise = chunkify.reduce(['A', 'B', 'C', 'D'], fn, {chunk: 3, delay: 1000});
      t.equals(fn.callCount, 2);
      return promise
    },

    after_tick(promise) {
      t.equals(fn.callCount, 3);
      promise.then((result) => {
        t.deepEquals(result, 'a+b+c+d');
        t.end()
      })
    }
  });
});

test('should resolve with the reduced result from a given memo', t => {
  let fn = sinon.spy((memo, letter, index, array) => {
    return `${memo.toLowerCase()}+${letter.toLowerCase()}`
  });

  tick({
    delay: 1000,

    before_tick() {
      let promise = chunkify.reduce(
        ['A', 'B', 'C', 'D'], fn, {chunk: 3, delay: 1000, memo: 'MEMO'});
      t.equals(fn.callCount, 3);
      return promise
    },

    after_tick(promise) {
      t.equals(fn.callCount, 4);
      promise.then((result) => {
        t.deepEquals(result, 'memo+a+b+c+d');
        t.end()
      })
    }
  });
});

test('should reject the promise with rejection object and stop processing', t => {
  let error = {};
  let fn = sinon.spy((memo, letter) => {
    if (letter === 'B') {
      throw error;
    }
  });

  chunkify.reduce(['A', 'B', 'C'], fn, {chunk: 3, memo: ''}).then(null, (rejection) => {
    t.deepEquals(rejection, {error, item: 'B', index: 1});
    t.equals(fn.callCount, 2);
    t.end()
  })
});

test('should not yield after `chunk` iterations if processing is complete', t => {
  let fn = sinon.spy();

  tick({
    delay: 2000,

    before_tick() {
      chunkify.reduce(['A', 'B', 'C'], fn, {chunk: 3, delay: 1000, memo: ''});
      t.equals(fn.callCount, 3)
    },

    after_tick() {
      t.equals(fn.callCount, 3);
      t.end()
    }
  });
});