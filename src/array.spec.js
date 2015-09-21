import test from 'tape'
import chunkify from './index'
import ChunkifyOptions from './options'
import sinon from 'sinon'
import _ from 'underscore'

let spy_ChunkifyOptions_of = (callback) => {
  let spy = sinon.spy(ChunkifyOptions, 'of');
  callback(spy);
  ChunkifyOptions.of.restore()
};

let tick = ({before_tick, after_tick, ms}) => {
  let clock = sinon.useFakeTimers();
  if (_.isFunction(before_tick)) {
    before_tick();
  }
  clock.tick(ms);
  if (_.isFunction(after_tick)) {
    after_tick();
  }
  clock.restore();
};

test('should require an array', t => {
  t.throws(() => {
    chunkify.array()
  }, /Usage: chunkify.array\(Array array, Function fn, \[Object] options\) - bad array/);
  t.end()
});

test('should require a function', t => {
  t.throws(() => {
    chunkify.array([])
  }, /Usage: chunkify.array\(Array array, Function fn, \[Object] options\) - bad fn/);
  t.end()
});

test('should delegate options deserialization', t => {
  let options = {};

  spy_ChunkifyOptions_of((chunkify_options) => {
    chunkify.array([], function() {}, options);
    t.ok(chunkify_options.calledWith(options));
  });

  t.end()
});

test('should default options to an empty object', t => {
  spy_ChunkifyOptions_of((chunkify_options) => {
    chunkify.array([], function() {});
    t.ok(chunkify_options.calledWith({}));
  });

  t.end()
});

test('should return a promise', t => {
  t.ok(chunkify.array([], function() {}) instanceof Promise);
  t.end()
});

test('should not invoke fn when given an empty array', t => {
  let fn = sinon.spy();

  chunkify.array([], fn).then((result) => {
    t.notOk(fn.called);
    t.end();
  });
});

test.skip('should invoke fn on the array between 0 and `chunk` iterations', t => {

});

test.skip('should yield after `chunk` iterations', t => {

});

test.skip('should start again in `delay` milliseconds after yielding', t => {

});

test.skip('should resolve with the array after processing completes', t => {

});

test.skip('should reject the promise with a thrown error and the index of occurrence', t => {

});

test.skip('should not yield after `chunk` iterations if processing is complete', t => {

});