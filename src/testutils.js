import sinon from 'sinon'
import ChunkifyOptions from './options'


let ChunkifyOptionsSpy = (callback) => {
  callback(sinon.spy(ChunkifyOptions, 'of'));
  ChunkifyOptions.of.restore()
};

let tick = ({before_tick, after_tick, delay}) => {
  let clock = sinon.useFakeTimers();
  let before_tick_result = before_tick();
  clock.tick(delay);
  after_tick(before_tick_result);
  clock.restore();
};

export default {ChunkifyOptionsSpy, tick}