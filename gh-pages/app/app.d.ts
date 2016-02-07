declare interface IExperiment {
  chunkified: boolean;
  length: number;
  progress: number;

  actions: {[actionName: string]: number};
  options: IChunkifyOptions;

  isSelected(action: number): boolean;
  isRunning(): boolean;

  getActionName(actionNumber: number): string;
  getAction(): number;
  setAction(action: number): void;

  execute(action: number): void;
}
