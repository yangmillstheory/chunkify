import {useFakeTimers} from 'sinon';


export var tick = (beforeTick: Function, afterTick: Function, delay: number) => {
  let CLOCK = useFakeTimers();

  let beforeTickResult = beforeTick();

  CLOCK.tick(delay);
  CLOCK.restore();

  // call afterTick after everything in the
  // stack and all its queued events have run
  setTimeout(afterTick, 0, beforeTickResult);
};

export var now = (): number => {
  return Number(new Date).valueOf();
};
