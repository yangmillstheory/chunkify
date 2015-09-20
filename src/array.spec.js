import test from 'tape'
import chunkify from './index'


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

test.skip('should delegate options deserialization', t => {

});

test.skip('should return a promise', t => {

});

test.skip('should not invoke fn when given an empty array', t => {

});

test.skip('should invoke fn successively between "chunk" iterations', t => {

});

test.skip('should yield after "chunk" iterations', t => {

});

test.skip('should start again after yielding in "delay" milliseconds', t => {

});

test.skip('should resolve with the array after processing completes', t => {

});

test.skip('should reject the promise if an error is thrown', t => {

});

test.skip('should not yield after "chunk" iterations if processing is complete', t => {

});