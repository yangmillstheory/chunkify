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


