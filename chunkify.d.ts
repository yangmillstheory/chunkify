//////////////
// API options
declare interface IChOptions {
  chunk?: number;
  delay?: number;
  scope?: Object;
}

declare interface IChPause { resume(fn: () => void); }

declare module 'chunkify' {
  // write me!
}
