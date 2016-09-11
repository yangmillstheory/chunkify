import {useFakeTimers} from 'sinon';


export var tick = function(tickParams: {
  before: Function,
  after: Function,
  delay: number,
}): void {
  let time = useFakeTimers();
  let beforeResult = tickParams.before();

  time.tick(tickParams.delay);
  time.restore();

  setTimeout(
    function(): void {
      tickParams.after(beforeResult);
    },
    0
  );
};

export var now = function(): number {
  return Number(new Date).valueOf();
};
