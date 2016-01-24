//////////////
// API options
declare interface IChOptions {
  chunk?: number;
  delay?: number;
  scope?: Object;
}

declare interface IChReduceOptions<T> extends IChOptions {
  memo?: T;
}

declare interface IChReducer<T, U> extends Function {
  (memo: U, item: T, index: number, array: T[]): U;
}

declare interface IChMapper<T> extends Function {
  (item: T): T;
}

declare interface IChPause { resume(fn: () => void); }

declare module 'chunkify' {
  // write me!
}
