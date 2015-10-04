import sinon from 'sinon'
import ChunkifyOptions from './options'
import _ from 'underscore'


let ChunkifyOptionsSpy = (callback) => {
  callback(sinon.spy(ChunkifyOptions, 'of'));
  ChunkifyOptions.of.restore()
};

/**
 * Invokes `before_tick`, then advances the clock by `delay` milliseconds, then
 * invokes `after_tick` as soon as all previously queued events have been processed.
 */
let tick = ({before_tick, after_tick, delay}) => {
  let clock = sinon.useFakeTimers();
  let before_tick_result = before_tick();
  clock.tick(delay);
  clock.restore();
  // call `after_tick` after this stack and all its queued events have unwound
  setTimeout(after_tick, 0, before_tick_result);
};

export default {ChunkifyOptionsSpy, tick}