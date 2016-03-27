const experimentConsumerCode = function(experimentAction: ExperimentAction): string {
  if (experimentAction === 'range' || experimentAction === 'each') {
    return '';
  } else if (experimentAction === 'map') {
    return `let mapper = function(item: number, index: number): number {
  return indexConsumer(index) + 1;
};`;
  } else {
    return `let reducer = function(memo: number, item: number): number {
  return memo + indexConsumer(item);
};
let memo = 0;`;
  }
};


let experimentActionCode = function(experiment: IExperiment): string {
  let experimentAction = experiment.getAction();
  let chunkified = experiment.chunkified;
  switch (experimentAction) {
    case 'each':
      if (chunkified) {
        return 'return chunkify.each(RANGE, indexConsumer, {chunk, delay})';
      }
      return 'return RANGE.forEach(indexConsumer)';
    case 'map':
      if (chunkified) {
        return 'return chunkify.map(RANGE, mapper, {chunk, delay})';
      }
      return 'return RANGE.map(mapper)';
    case 'reduce':
      if (chunkified) {
        return 'return chunkify.reduce(RANGE, reducer, memo, {chunk, delay})';
      }
      return 'return RANGE.reduce(reducer, memo)';
    case 'range':
      if (chunkified) {
        return 'return chunkify.range(indexConsumer, RANGE.length, {chunk, delay})';
      }
      return '' +
`for (let index = 0; index < RANGE.length; index++) {
  indexConsumer(index);
}`;
    default:
      throw new Error(`Unknown experiment action: ${experimentAction}`);
  }
};

export var experimentCode = function(): (experiment: IExperiment) => string {
  return function(experiment: IExperiment): string {
    if (experiment.getAction() === undefined) {
      return 'Hover over an action button on the left sidebar.';
    }
    let experimentAction = experiment.getAction();
    let experimentDescription = [
      `// action: ${experimentAction}`,
      `// chunkified: ${experiment.chunkified}`,
    ];
    let consumerCode = experimentConsumerCode(experimentAction);
    if (consumerCode) {
      experimentDescription.push(consumerCode);
    }
    experimentDescription.push(experimentActionCode(experiment));
    return experimentDescription.join('\n');
  };
};
