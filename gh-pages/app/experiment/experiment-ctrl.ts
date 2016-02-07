import {applyAction} from './action';
import {
  RANGE,
  DEFAULT_CHUNK,
  DEFAULT_DELAY
} from './defaults';


export var ExperimentCtrl = function($timeout: ng.ITimeoutService): void {
  // We attach to an object literal because 'this' is of type any.
  //
  // https://github.com/Microsoft/TypeScript/issues/3694
  let experiment: IExperiment;

  let currentAction: ExperimentAction;

  let updateProgress = function(value?: number): void {
    if (typeof value === 'number') {
      experiment.progress = value;
    } else {
      experiment.progress += 1;
    }
  };

  let actionConsumer = function(): void {
    $timeout(function(): void { updateProgress(); });
  };

  let reset = function(): void {
    $timeout(
      function(): void {
        updateProgress(0);
        currentAction = undefined;
      },
      1000
    );
  };

  experiment = {

    chunkified: true,

    progress: 0,

    options: {
      chunk: DEFAULT_CHUNK,
      delay: DEFAULT_DELAY,
    },

    length: RANGE.length,

    actions: [
      'EACH',
      'MAP',
      'REDUCE',
      'RANGE',
    ],

    isSelected: function(action: ExperimentAction): boolean {
      return action === currentAction;
    },

    isRunning: function(): boolean {
      return currentAction !== undefined;
    },

    setAction: function(action: ExperimentAction): void {
      currentAction = action;
    },

    getAction: function(): ExperimentAction {
      return currentAction;
    },

    execute: function(action: ExperimentAction): void {
      currentAction = action;
      applyAction(action, actionConsumer, experiment.chunkified, this.options)
      .then(reset);
    }
  };

  Object.assign(this, experiment);

};
