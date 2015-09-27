import chunkify from './chunkify'
import test from 'tape'


test('should only pause every `chunk` iterations', t => {
  let it = chunkify.range({start: 0, final: 3, chunk: 2});

  t.deepEquals(it.next(), {done: false, value: {index: 0, pause: false}});
  t.deepEquals(it.next(), {done: false, value: {index: 1, pause: true}});
  t.deepEquals(it.next(), {done: false, value: {index: 2, pause: false}});
  t.deepEquals(it.next(), {done: true, value: undefined});
  t.end()
});


test('should only pause every `chunk` iterations from a given `start`', t => {
  let it = chunkify.range({start: 1, final: 4, chunk: 2});

  t.deepEquals(it.next(), {done: false, value: {index: 1, pause: false}});
  t.deepEquals(it.next(), {done: false, value: {index: 2, pause: true}});
  t.deepEquals(it.next(), {done: false, value: {index: 3, pause: false}});
  t.deepEquals(it.next(), {done: true, value: undefined});
  t.end()
});