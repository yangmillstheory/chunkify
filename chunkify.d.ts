//////////////
// API options
declare interface IChOptions {
  chunk?: number;
  delay?: number;
  scope?: Object;
}

declare interface IPause { resume(fn: () => void); }

declare module 'chunkify' {
  // write me!
}
