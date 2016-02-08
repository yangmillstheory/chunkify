import {Action} from '../experiment';


const actionConsumers: Map<number, string> = new Map();
actionConsumers.set(Action.EACH, '');

actionConsumers.set(Action.MAP,
`let mapper = function(item: number, index: number): number {
  return indexConsumer(index) + 1;
};`);

actionConsumers.set(Action.REDUCE,
`let reducer = function(memo: number, item: number): number {
  return memo + indexConsumer(item);
};
let memo = 0;`);

actionConsumers.set(Action.RANGE, '');


let actionCall = function(experiment: IExperiment): string {
  let action = experiment.getAction();
  let chunkified = experiment.chunkified;
  switch (action) {
    case Action.EACH:
      if (chunkified) {
        return 'return chunkify.each(RANGE, indexConsumer, {chunk, delay})';
      }
      return 'return RANGE.forEach(indexConsumer)';
    case Action.MAP:
      if (chunkified) {
        return 'return chunkify.map(RANGE, mapper, {chunk, delay})';
      }
      return 'return RANGE.map(mapper)';
    case Action.REDUCE:
      if (chunkified) {
        return 'return chunkify.reduce(RANGE, reducer, memo, {chunk, delay})';
      }
      return 'return RANGE.reduce(reducer, memo)';
    case Action.RANGE:
      if (chunkified) {
        return 'return chunkify.range(indexConsumer, RANGE.length, {chunk, delay})';
      }
      return '' +
`for (let index = 0; index < RANGE.length; index++) {
  indexConsumer(index);
}`;
    default:
      throw new Error(`Unknown experiment action: ${action}`);
  }
};

export var experimentCode = function(): (experiment: IExperiment) => string {
  return  function(experiment: IExperiment): string {
    if (experiment.getAction() === undefined) {
      return 'Hover over an action button on the left sidebar.';
    }
    let action = experiment.getAction();
    let phrase = [
      `// action: ${experiment.getActionName(action)}`,
      `// chunkified: ${experiment.chunkified}`,
    ];
    let consumer = actionConsumers.get(action);
    if (consumer) {
      phrase.push(consumer);
    }
    phrase.push(actionCall(experiment));
    return phrase.join('\n');
  };
};
