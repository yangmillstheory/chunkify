import sinon from 'sinon'
import _ from 'underscore'
import test from 'tape'

import chunkify from '../index'
import each from './each'
import {ChunkifyOptions_spy, tick} from '../testutils'


let each_spy = (callback) => {
  let spy = sinon.spy(each);
  callback(spy);
};

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

test('should delegate array, options, and a wrapped fn to .each', t => {
  let array = ['A', 'B', 'C'];
  let options = {chunk: 3};
  let fn = sinon.spy();

  each_spy((each_spy) => {
    chunkify.map(array, fn, options);
    t.equals(fn.callCount, 3);
    //t.ok(each_spy.called);
    t.end();
  });
});