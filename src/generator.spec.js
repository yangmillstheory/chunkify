import {ChunkifyOptionsSpy} from './testutils'
import chunkify from './index'
import test from 'tape'


// FIXME (?): these tests are non-deterministic
const DELAY = 10;
const TOLERANCE = 5;

test('should throw when not given a number start index', t => {
  for (let start of [undefined, null, 'string', {}, []]) {
    t.throws(() => {
      chunkify.generator(start);
    }, /start index `start` of generator range must be a number/);
  }
  t.end()
});

test('should throw when not given a number final index', t => {
  for (let final of [undefined, null, 'string', {}, []]) {
    t.throws(() => {
      chunkify.generator(0, final);
    }, /final index `final` of generator range must be a number/);
  }
  t.end()
});

test('should pass `chunk` and `delay` to options helper class', t => {
  let chunk = 1;
  let delay = 0;
  ChunkifyOptionsSpy((spy) => {
    chunkify.generator(0, 1, {chunk, delay});
    t.ok(spy.calledWith({chunk, delay}));
    t.end()
  });
});

test('should yield a "timeout promise" delay after `chunk` iterations', t => {
  let it = chunkify.generator(0, 3, {chunk: 2, delay: DELAY});

  t.deepEquals(it.next(), {done: false, value: 0});
  t.deepEquals(it.next(), {done: false, value: 1});

  let timeout = it.next().value;
  let started = new Date();
  let elapsed;

  t.ok(timeout instanceof Promise);

  timeout.then(() => {
    elapsed = new Date() - started;
    t.ok(elapsed >= DELAY);
    t.ok(elapsed <= DELAY + TOLERANCE);
    t.deepEquals(it.next(), {done: false, value: 2});
    t.end()
  });
});

test('should throw an error if advanced while delay is pending', t => {
  let it = chunkify.generator(0, 3, {chunk: 2, delay: 100});

  it.next();
  it.next();
  it.next();  // enters paused state

  t.throws(() => {
    it.next();
  }, /paused at index 2; wait 100 milliseconds/);
  t.end()
});

test('should yield a "timeout promise" after `chunk` iterations from a given `start`', t => {
  let it = chunkify.generator(1, 4, {chunk: 2, delay: 10});

  t.deepEquals(it.next(), {done: false, value: 1});
  t.deepEquals(it.next(), {done: false, value: 2});

  let timeout = it.next().value;
  let started = new Date();
  let elapsed;

  t.ok(timeout instanceof Promise);

  timeout.then(() => {
    elapsed = new Date() - started;
    t.ok(elapsed >= DELAY);
    t.ok(elapsed <= DELAY + TOLERANCE);
    t.deepEquals(it.next(), {done: false, value: 3});
    t.deepEquals(it.next(), {done: true, value: undefined});
    t.end()
  });
});

test('should throw an error if advanced while delay is pending from a given start', t => {
  let it = chunkify.generator(1, 4, {chunk: 2, delay: 100});

  it.next();
  it.next();
  it.next();  // enters paused state

  t.throws(() => {
    it.next();
  }, /paused at index 3; wait 100 milliseconds/);
  t.end()
});