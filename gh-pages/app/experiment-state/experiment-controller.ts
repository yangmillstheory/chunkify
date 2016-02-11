import {applyAction, ExperimentAction} from './experiment-action';
import {
  RANGE,
  CHUNK,
  DELAY
} from './experiment-defaults';


export var ExperimentCtrl = function($timeout: ng.ITimeoutService): void {
  'ngInject';
  // We attach to an object literal because 'this' is of type any.
  // The pattern here lets compile-time checking work with the closure pattern.
  //
  // https://github.com/Microsoft/TypeScript/issues/3694
  let experimentCtrl: IExperiment;

  let running = false;

  let currentAction: ExperimentAction;

  let updateProgress = function(value?: number): void {
    if (typeof value === 'number') {
      experimentCtrl.progress = value;
    } else {
      experimentCtrl.progress += 1;
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

  experimentCtrl = {

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

    isSelected(action: ExperimentAction): boolean {
      return action === currentAction;
    },

    isRunning(): boolean {
      return running;
    },

    setAction(action: ExperimentAction): void {
      currentAction = action;
    },

    getAction(): ExperimentAction {
      return currentAction;
    },

    getActionName(actionNumber: number): string {
      return Object.keys(experimentCtrl.actions)[actionNumber];
    },

    run(action: ExperimentAction): void {
      running = true;
      experimentCtrl.setAction(action);
      applyAction(currentAction, actionConsumer, experimentCtrl.chunkified, experimentCtrl.options)
        .then(reset);
    }
  };

  Object.assign(this, experimentCtrl);

  experimentCtrl = this;

};
