import test from 'tape'
import ChunkifyOptions from './options'


test('should throw when receiving non-object literal options', t => {
  let WRONG_TYPES = [
    false,
    true,
    null,
    undefined,
    [],
    function() {}
  ];
  for (let thing of WRONG_TYPES) {
    t.throws(() => {
      ChunkifyOptions.of(thing)
    }, new RegExp(`Expected options object, got ${typeof thing}`))
  }
  t.end()
});

test('should have defaults', t => {
  let options = ChunkifyOptions.of({});
  t.equals(typeof options.delay, 'number');
  t.equals(typeof options.chunk, 'number');
  t.end()
});

test('should override all defaults', t => {
  let chunk = 50;
  let delay = 100;

  let options = ChunkifyOptions.of({chunk, delay});

  t.equals(options.chunk, chunk);
  t.equals(options.delay, delay);
  t.end()
});

test('should override some defaults', t => {
  let chunk = 50;
  let delay = 100;

  let options = ChunkifyOptions.of({chunk});

  t.equals(options.chunk, chunk);
  t.notEquals(options.delay, delay);

  options = ChunkifyOptions.of({delay});

  t.equals(options.delay, delay);
  t.notEquals(options.chunk, chunk);

  t.end()
});

test('should throw when an option override has the wrong type', t => {
  let chunk = function() {};
  let delay = [];

  t.throws(() => {
    ChunkifyOptions.of({chunk})
  }, /'chunk' should be a positive number/);
  t.throws(() => {
    ChunkifyOptions.of({delay})
  }, /'delay' should be a non-negative number/);
  t.end()
});

test('should throw when an option override has the wrong value', t => {
  let chunk = function() {};
  let delay = [];

  t.throws(() => {
    ChunkifyOptions.of({chunk})
  }, /'chunk' should be a positive number/);
  t.throws(() => {
    ChunkifyOptions.of({delay})
  }, /'delay' should be a non-negative number/);
  t.end()
});

test('should be immutable', t => {
  let chunk = 50;
  let delay = 100;

  let options = ChunkifyOptions.of({chunk, delay});

  t.throws(() => {
    options.delay = 0
  }, /delay is immutable/);
  t.throws(() => {
    options.chunk = 1
  }, /chunk is immutable/);

  delete options.delay;
  delete options.chunk;

  t.ok(options.delay);
  t.ok(options.chunk);

  t.end()
});





