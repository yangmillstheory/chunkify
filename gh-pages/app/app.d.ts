declare interface IMetered {
  length: number;
  progress: number;
}


declare interface IExperiment extends IMetered {
  chunkified: boolean;

  actions: {[actionName: string]: number};
  options: IChunkifyOptions;

  isSelected(action: number): boolean;
  isRunning(): boolean;

  getActionName(actionNumber: number): string;
  getAction(): number;
  setAction(action: number): void;

  execute(action: number): void;
}
