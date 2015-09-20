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

test.skip('should override some defaults', t => {
});

test.skip('should throw when an option override has the wrong type', t => {

});

test.skip('should be read-only', t => {

});





