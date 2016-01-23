import {useFakeTimers} from 'sinon';


var CLOCK;

let tick = (beforeTick: Function, afterTick: Function, delay: number) => {
  CLOCK = useFakeTimers();

  let beforeTickResult = beforeTick();

  CLOCK.tick(delay);
  CLOCK.restore();

  // call afterTick after everything in the
  // stack and all its queued events have run
  setTimeout(afterTick, 0, beforeTickResult);
};

export default {tick};