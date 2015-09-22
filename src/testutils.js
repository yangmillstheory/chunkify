import sinon from 'sinon'
import ChunkifyOptions from './options'
import _ from 'underscore'


let ChunkifyOptionsSpy = (callback) => {
  callback(sinon.spy(ChunkifyOptions, 'of'));
  ChunkifyOptions.of.restore()
};

let tick = ({before_tick, after_tick, delay}) => {
  let ok_tick = () => {
    if (!_.isFunction(before_tick)) {
      throw new Error(`Expected before_tick function, got ${before_tick}`);
    } else if (!_.isFunction(after_tick)) {
      throw new Error(`Expected after_tick function, got ${after_tick}`);
    } else if (!_.isNumber(delay)) {
      throw new Error(`Expected number delay, got ${delay}`);
    }
  };
  ok_tick();
  let clock = sinon.useFakeTimers();
  let before_tick_result = before_tick();
  clock.tick(delay);
  after_tick(before_tick_result);
  clock.restore();
};

export default {ChunkifyOptionsSpy, tick}