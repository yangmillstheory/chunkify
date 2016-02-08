import {applyAction, ExperimentAction} from './experiment-action';
import {
  RANGE,
  CHUNK,
  DELAY
} from './experiment-defaults';


export var ExperimentCtrl = function($scope: ng.IScope, $timeout: ng.ITimeoutService): void {
  // We attach to an object literal because 'this' is of type any.
  // The pattern here lets compile-time checking work with the closure pattern.
  //
  // https://github.com/Microsoft/TypeScript/issues/3694
  let api: IExperiment;

  let running = false;

  let currentAction: ExperimentAction;

  let updateProgress = (value?: number): void => {
    if (typeof value === 'number') {
      api.progress = value;
    } else {
      api.progress += 1;
    }
  };

  let actionConsumer = function(): void {
    $timeout(function(): void { updateProgress(); });
  };

  let reset = function(): void {
    $timeout(
      function(): void {
        updateProgress(0);
        running = false;
      },
      1000
    );
  };

  api = {

    chunkified: true,

    progress: 0,

    options: {
      chunk: CHUNK,
      delay: DELAY,
    },

    length: RANGE.length,

    actions: {
      each: ExperimentAction.EACH,
      map: ExperimentAction.MAP,
      reduce: ExperimentAction.REDUCE,
      range: ExperimentAction.RANGE,
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
      api.setAction(action);
      applyAction(currentAction, actionConsumer, api.chunkified, api.options)
        .then(reset);
    }
  };

  Object.assign(this, api);

  api = this;

};
