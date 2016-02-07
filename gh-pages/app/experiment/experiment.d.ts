interface IExperiment {
  chunkified: boolean;
  options: IChunkifyOptions;
  progress: number;
  length: number;
  actions: number[];

  isSelected(action: number): boolean;
  isRunning(): boolean;
  getAction(): number;
  setAction(action: number): void;
  execute(action: number): void;
}
