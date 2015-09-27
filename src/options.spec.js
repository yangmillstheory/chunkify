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
  t.equals(options.delay, 0);
  t.equals(options.chunk, 1);
  t.equals(options.scope, null);
  t.end()
});

test('should override all defaults', t => {
  let chunk = 50;
  let delay = 100;
  let scope = {};

  let options = ChunkifyOptions.of({chunk, delay, scope});

  t.equals(options.chunk, chunk);
  t.equals(options.delay, delay);
  t.equals(options.scope, scope);
  t.end()
});

test('should override some defaults', t => {
  let chunk = 50;
  let delay = 100;
  let scope = {};

  let options = ChunkifyOptions.of({chunk});

  t.equals(options.chunk, chunk);
  t.notEquals(options.scope, scope);
  t.notEquals(options.delay, delay);

  options = ChunkifyOptions.of({delay, scope});

  t.equals(options.delay, delay);
  t.equals(options.scope, scope);
  t.notEquals(options.chunk, chunk);

  options = ChunkifyOptions.of({scope});

  t.equals(options.scope, scope);
  t.notEquals(options.chunk, chunk);
  t.notEquals(options.delay, delay);

  t.end()
});

test('should throw when an option override has the wrong type', t => {
  let chunk = function() {};
  let delay = [];
  let scope = false;

  t.throws(() => {
    ChunkifyOptions.of({chunk})
  }, /'chunk' should be a positive number/);
  t.throws(() => {
    ChunkifyOptions.of({delay})
  }, /'delay' should be a non-negative number/);
  t.throws(() => {
    ChunkifyOptions.of({scope})
  }, /'scope' should be a defined non-boolean and non-number, or null/);
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
  let scope = {};

  let options = ChunkifyOptions.of({chunk, delay, scope});

  t.throws(() => {
    options.delay = 0
  }, /delay is immutable/);
  t.throws(() => {
    options.chunk = 1
  }, /chunk is immutable/);
  t.throws(() => {
    options.scope = this
  }, /scope is immutable/);

  delete options.delay;
  delete options.chunk;
  delete options.scope;

  t.ok(options.delay);
  t.ok(options.chunk);
  t.ok(options.scope);

  t.end()
});





