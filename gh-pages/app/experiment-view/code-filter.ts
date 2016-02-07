const actionConsumers: Map<ExperimentAction, string> = new Map();
actionConsumers.set('EACH',
`let eachFn = function(index) {
  simulateWork(index);
};`);

actionConsumers.set('MAP',
`let mapper = function(item, index) {
  return simulateWork(index) + 1;
};`);

actionConsumers.set('REDUCE',
`let reducer = function(memo, item, index) {
  return memo + simulateWork(index);
};
let memo = 0;`);

actionConsumers.set('RANGE',
`let loopFn = function(index) {
  simulateWork(index);
};`);


let actionCall = function(experiment: IExperiment): string {
  let action = experiment.getAction();
  let chunkified = experiment.chunkified;
  switch (action) {
    case 'EACH':
      if (chunkified) {
        return 'return chunkify.each(RANGE, eachFn, {chunk, delay})';
      }
      return 'return RANGE.forEach(eachFn)';
    case 'MAP':
      if (chunkified) {
        return 'return chunkify.each(RANGE, eachFn, {chunk, delay})';
      }
      return 'return RANGE.forEach(eachFn)';
    case 'REDUCE':
      if (chunkified) {
        return 'return chunkify.reduce(RANGE, reducer, {memo, chunk, delay})';
      }
      return 'return RANGE.reduce(reducer, memo)';
    case 'RANGE':
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

export var experimentCode = function(experiment: IExperiment): string {
  if (!experiment.isRunning()) {
    return 'Hover over an action button on the left sidebar.';
  }
  let action = experiment.getAction();
  return [
    `// action: ${action}`,
    `// chunkified: ${experiment.chunkified}`,
    actionConsumers.get(action),
    actionCall(experiment),
  ].join('\n');
};
