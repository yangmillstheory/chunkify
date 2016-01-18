import sinon from 'sinon'
import ChunkifyOptions from './options'


let ChunkifyOptionsSpy = (callback) => {
  callback(sinon.spy(ChunkifyOptions, 'of'));
  ChunkifyOptions.of.restore()
};


// Invokes `beforeTick`, then advances the clock by `delay` milliseconds, then
// invokes `afterTick` as soon as all previously queued events have been processed.
let tick = ({beforeTick, afterTick, delay}) => {
  let clock = sinon.useFakeTimers();
  let beforeTickResult = beforeTick();
  clock.tick(delay);
  clock.restore();
  // call `afterTick` after this stack and all its queued events have unwound
  setTimeout(afterTick, 0, beforeTickResult);
};

export default {ChunkifyOptionsSpy, tick}