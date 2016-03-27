declare interface IMetered {
  length: number;
  progress: number;
}

declare type ExperimentAction = 'each' | 'map' | 'reduce' | 'range';

declare interface IExperiment extends IMetered {
  chunkified: boolean;

  actions: ExperimentAction[];
  options: IChunkifyOptions;

  isSelected(experimentAction: ExperimentAction): boolean;
  isRunning(): boolean;

  getAction(): ExperimentAction;
  setAction(experimentAction: ExperimentAction): void;

  run(experimentAction: ExperimentAction): void;
}
