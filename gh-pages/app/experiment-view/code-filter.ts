import {Action} from '../experiment';


const actionConsumers: Map<number, string> = new Map();
actionConsumers.set(Action.EACH,
`let eachFn = function(index) {
  simulateWork(index);
};`);

actionConsumers.set(Action.MAP,
`let mapper = function(item, index) {
  return simulateWork(index) + 1;
};`);

actionConsumers.set(Action.REDUCE,
`let reducer = function(memo, item, index) {
  return memo + simulateWork(index);
};
let memo = 0;`);

actionConsumers.set(Action.RANGE,
`let loopFn = function(index) {
  simulateWork(index);
};`);


let actionCall = function(experiment: IExperiment): string {
  let action = experiment.getAction();
  let chunkified = experiment.chunkified;
  switch (action) {
    case Action.EACH:
      if (chunkified) {
        return 'return chunkify.each(RANGE, eachFn, {chunk, delay})';
      }
      return 'return RANGE.forEach(eachFn)';
    case Action.MAP:
      if (chunkified) {
        return 'return chunkify.each(RANGE, eachFn, {chunk, delay})';
      }
      return 'return RANGE.forEach(eachFn)';
    case Action.REDUCE:
      if (chunkified) {
        return 'return chunkify.reduce(RANGE, reducer, {memo, chunk, delay})';
      }
      return 'return RANGE.reduce(reducer, memo)';
    case Action.RANGE:
      if (chunkified) {
        return 'return chunkify.range(loopFn, RANGE.length, {chunk, delay})';
      }
      return '' +
`for (let index = 0; index < RANGE.length; index++) {
  loopFn(index)
}`;
    default:
      throw new Error(`Unknown experiment action: ${action}`);
  }
};

export var experimentCode = function(): (experiment: IExperiment) => string {
  return  function(experiment: IExperiment): string {
    if (!experiment.isRunning()) {
      return 'Hover over an action button on the left sidebar.';
    }
    let action = experiment.getAction();
    return [
      `// action: ${experiment.getActionName(action)}`,
      `// chunkified: ${experiment.chunkified}`,
      actionConsumers.get(action),
      actionCall(experiment),
    ].join('\n');
  };
};
