declare type ExperimentAction = 'EACH' | 'MAP' | 'REDUCE' | 'RANGE';

declare interface IExperiment {
  chunkified: boolean;
  length: number;
  progress: number;

  actions: ExperimentAction[];
  options: IChunkifyOptions;

  isSelected(action: ExperimentAction): boolean;
  isRunning(): boolean;

  getAction(): ExperimentAction;
  setAction(action: ExperimentAction): void;

  execute(action: ExperimentAction): void;
}
