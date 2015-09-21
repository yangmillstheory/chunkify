import sinon from 'sinon'
import ChunkifyOptions from '../options'
import chunkify from '../index'


let ChunkifyOptions_spy = (callback) => {
  let spy = sinon.spy(ChunkifyOptions, 'of');
  callback(spy);
  ChunkifyOptions.of.restore()
};

let chunkify_each_spy = (callback) => {
  let spy = sinon.spy(chunkify, 'each');
  callback(spy);
  chunkify.each.restore()
};

let tick = ({before_tick, after_tick, delay}) => {
  let clock = sinon.useFakeTimers();
  let before_tick_result = before_tick();
  clock.tick(delay);
  after_tick(before_tick_result);
  clock.restore();
};

export default {ChunkifyOptions_spy, chunkify_each_spy, tick}