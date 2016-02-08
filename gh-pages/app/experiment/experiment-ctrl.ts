import {applyAction, ExperimentAction} from './action';
import {
  RANGE,
  CHUNK,
  DELAY
} from './defaults';


export var ExperimentCtrl = function($timeout: ng.ITimeoutService): void {
  // We attach to an object literal because 'this' is of type any.
  //
  // https://github.com/Microsoft/TypeScript/issues/3694
  let experiment: IExperiment;

  let running = false;

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
        running = false;
      },
      1000
    );
  };

  experiment = {

    chunkified: true,

    progress: 0,

    options: {
      chunk: CHUNK,
      delay: DELAY,
    },

    length: RANGE.length,

    actions: {
      'each': ExperimentAction.EACH,
      'map': ExperimentAction.MAP,
      'reduce': ExperimentAction.REDUCE,
      'range': ExperimentAction.RANGE,
    },

    isSelected: function(action: ExperimentAction): boolean {
      return action === currentAction;
    },

    isRunning: function(): boolean {
      return running;
    },

    setAction: function(action: ExperimentAction): void {
      currentAction = action;
    },

    getAction: function(): ExperimentAction {
      return currentAction;
    },

    getActionName: function(actionNumber: number): string {
      return Object.keys(this.actions)[actionNumber];
    },

    execute: function(action: ExperimentAction): void {
      running = true;
      currentAction = action;
      applyAction(currentAction, actionConsumer, experiment.chunkified, this.options)
      .then(reset);
    }
  };

  Object.assign(this, experiment);

};
