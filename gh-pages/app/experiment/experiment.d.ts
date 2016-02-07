declare interface IExperiment {
  chunkified: boolean;
  isSelected(action: number): boolean;
  isRunning(): boolean;
  select(action: number): void;
  getAction(): number;
}
