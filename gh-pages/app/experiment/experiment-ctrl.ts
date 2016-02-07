import {ExperimentAction, applyAction} from './action';
import {
  RANGE,
  DEFAULT_CHUNK,
  DEFAULT_DELAY
} from './defaults';


export var ExperimentCtrl = function($timeout: ng.ITimeoutService): void {
  // We attach to an object literal instead of 'this' because typing will not work.
  //
  // https://github.com/Microsoft/TypeScript/issues/3694
  let ctrl: IExperiment;

  let currentAction: ExperimentAction;

  let updateProgress = function(value?: number): void {
    if (typeof value === 'number') {
      ctrl.progress = value;
    } else {
      ctrl.progress += 1;
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

  ctrl = {

    chunkified: true,

    progress: 0,

    options: {
      chunk: DEFAULT_CHUNK,
      delay: DEFAULT_DELAY,
    },

    length: RANGE.length,

    actions: [
      ExperimentAction.EACH,
      ExperimentAction.MAP,
      ExperimentAction.REDUCE,
      ExperimentAction.RANGE,
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
      applyAction(action, actionConsumer, ctrl.chunkified, this.options)
      .then(reset);
    }
  };

  Object.assign(this, ctrl);

};
