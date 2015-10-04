import chunkify from './chunkify'
import test from 'tape'


// FIXME (?): these tests are non-deterministic
const DELAY = 10;
const TOLERANCE = 5;


test('should yield a "timeout promise" delay after `chunk` iterations', t => {
  let it = chunkify.range({start: 0, final: 3, chunk: 2, delay: DELAY});

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


test('should yield a "timeout promise" after `chunk` iterations from a given `start`', t => {
  let it = chunkify.range({start: 1, final: 4, chunk: 2, delay: 10});

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