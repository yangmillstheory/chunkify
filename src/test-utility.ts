import {useFakeTimers} from 'sinon';


export var tick = function(tickParams: {
  before: Function,
  after: Function,
  delay: number,
}) {
  let time = useFakeTimers();
  let beforeResult = tickParams.before();

  time.tick(tickParams.delay);
  time.restore();

  // call "after" after everything in the
  // stack and all its queued events have run
  setTimeout(tickParams.after, 0, beforeResult);
};

export var now = function(): number {
  return Number(new Date).valueOf();
};
