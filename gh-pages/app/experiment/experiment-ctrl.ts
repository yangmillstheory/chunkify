import {ExperimentAction, applyAction} from './action';
import {
  RANGE,
  DEFAULT_CHUNK,
  DEFAULT_DELAY
} from './defaults';


export var ExperimentCtrl = function($timeout: ng.ITimeoutService): IExperiment {

  this.chunkified = true;
  this.range = RANGE.length;
  this.chunk = DEFAULT_CHUNK;
  this.delay = DEFAULT_DELAY;
  this.actions = [
    ExperimentAction.EACH,
    ExperimentAction.MAP,
    ExperimentAction.REDUCE,
    ExperimentAction.RANGE,
  ];

  let currentAction: ExperimentAction;

  let actionConsumer = (): void => {
    $timeout((): void => { this.updateProgress(); });
  };

  let updateProgress = (value?: number): void => {
    if (_.isNumber(value)) {
      this.progress = value;
    } else {
      this.progress += 1;
    }
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

  this.isSelected = function(action: ExperimentAction): boolean {
    return action === currentAction;
  };

  this.isRunning = function(): boolean {
    return currentAction !== undefined;
  };

  this.select = function(action: ExperimentAction): void {
    currentAction = action;
  };

  this.getAction = function(): ExperimentAction {
    return currentAction;
  };

  this.execute = function(action: ExperimentAction): void {
    currentAction = action;
    applyAction(action, actionConsumer, this.chunkified, {
      delay: this.delay,
      chunk: this.chunk
    })
    .then(reset);
  };

  return this;

};
