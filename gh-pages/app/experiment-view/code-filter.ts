import {Action} from '../experiment';


const PRELUDES = new Map([
  [
    Action.EACH,
`let eachFn = function(index) {
  simulateWork(index)
};`
  ],
  [
    Action.MAP,
`let mapper = function(item, index) {
  return simulateWork(index) + 1
};`
  ],
  [
    Action.REDUCE,
`let reducer = function(memo, item, index) {
  return memo + simulateWork(index);
};
let memo = 0;`
  ],
  [
    Action.RANGE,
`let loopFn = function(index) {
  simulateWork(index)
};`
  ]
]);


let getCode = function(experiment: IExperiment): string {
  let action = experiment.getAction();
  let chunkified = experiment.chunkified;
  let prelude = PRELUDES.get(action);
  if (prelude === undefined) {
    throw new Error(`Don't understand experiment action: ${action}`);
  }
  let code: string;
  switch (action) {
    case Action.EACH:
      if (chunkified) {
        code = 'return chunkify.each(RANGE, eachFn, {chunk, delay})';
      } else {
        code = 'return RANGE.forEach(eachFn)';
      }
      break;
    case Action.MAP:
      if (chunkified) {
        code = 'return chunkify.each(RANGE, eachFn, {chunk, delay})';
      } else {
        code = 'return RANGE.forEach(eachFn)';
      }
      break;
    case Action.REDUCE:
      if (chunkified) {
        code = 'return chunkify.reduce(RANGE, reducer, {memo, chunk, delay})';
      } else {
        code = 'return RANGE.reduce(reducer, memo)';
      }
      break;
    case Action.RANGE:
      if (chunkified) {
        code = 'return chunkify.range(loopFn, RANGE.length, {chunk, delay})';
      } else {
        code = `
for (let index = 0; index < RANGE.length; index++) {
  loopFn(index)
}`;
      }
      break;
    default:
      break;
  }
  return [prelude, code].join('\n');
};

export var experimentCode = function(experiment: IExperiment): string {
  if (!experiment.isRunning()) {
    return 'Hover over an action button on the left sidebar.';
  }
  return [
    `// action: ${experiment.getAction()}`,
    `// chunkified: ${experiment.chunkified}`,
    `// action: ${getCode(experiment)}`,
  ].join('\n');
};
