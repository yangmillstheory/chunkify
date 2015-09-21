import test from 'tape'
import chunkify from './index'
import ChunkifyOptions from '../options'
import {ChunkifyOptions_spy, chunkify_each_spy, tick} from './testutils'
import sinon from 'sinon'
import _ from 'underscore'


test('should require an array', t => {
  t.throws(() => {
    chunkify.map()
  }, /Usage: chunkify.map\(Array array, Function fn, \[Object options]\) - bad array/);
  t.end()
});

test('should require a function', t => {
  t.throws(() => {
    chunkify.map([])
  }, /Usage: chunkify.map\(Array array, Function fn, \[Object options]\) - bad fn/);
  t.end()
});

test.skip('should delegate array, options, and a wrapped fn to .each', t => {
  let array = ['A', 'B', 'C'];
  let options = {chunk: 3};
  let fn = sinon.spy();

  chunkify_each_spy((each_spy) => {
    chunkify.map(array, fn, options);
    t.ok(each_spy.called);
    t.end();
  });


  //t.ok(each_spy.calledWith(array));
  //t.ok(each_spy.calledWith(options));
});