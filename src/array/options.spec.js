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
  t.equals(typeof options.complete, 'function');
  t.equals(typeof options.delay, 'number');
  t.equals(typeof options.chunk, 'number');
  t.end()
});

test('should override all defaults', t => {
  let chunk = 50;
  let delay = 100;
  let complete = function() {};

  let options = ChunkifyOptions.of({chunk, delay, complete});

  t.equals(options.chunk, chunk);
  t.equals(options.delay, delay);
  t.equals(options.complete, complete);
  t.end()
});

test('should override some defaults', t => {
  let chunk = 50;
  let delay = 100;
  let complete = function() {};

  let options = ChunkifyOptions.of({chunk});

  t.equals(options.chunk, chunk);
  t.notEquals(options.delay, delay);
  t.notEquals(options.complete, complete);

  options = ChunkifyOptions.of({delay, complete});

  t.equals(options.delay, delay);
  t.equals(options.complete, complete);
  t.notEquals(options.chunk, chunk);

  options = ChunkifyOptions.of({complete});

  t.equals(options.complete, complete);
  t.notEquals(options.delay, delay);
  t.notEquals(options.chunk, chunk);

  t.end()
});

test('should throw when an option override has the wrong type', t => {
  let chunk = function() {};
  let delay = [];
  let complete = false;

  t.throws(() => {
    ChunkifyOptions.of({chunk})
  }, /Expected 'chunk' to be 'number', got 'function'/);
  t.throws(() => {
    ChunkifyOptions.of({delay})
  }, /Expected 'delay' to be 'number', got 'object'/);
  t.throws(() => {
    ChunkifyOptions.of({complete})
  }, /Expected 'complete' to be 'function', got 'boolean'/);
  t.end()
});

test.skip('should be read-only', t => {

});





