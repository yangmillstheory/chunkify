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

  process.nextTick(function() {
    tickParams.after(beforeResult);
  });
};

export var now = function(): number {
  return Number(new Date).valueOf();
};
