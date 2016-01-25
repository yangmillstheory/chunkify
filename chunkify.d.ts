//////////////
// API options
declare interface IChunkifyOptions {
  chunk?: number;
  delay?: number;
  scope?: Object;
}

declare interface IPause {
  resume(fn: () => void);
}

declare module 'chunkify' {

  /////////
  // arrays
  export var each: <T>(
    tArray: T[],
    tConsumer: (tItem: T, index: number) => void,
    options?: IChunkifyOptions
  ) => Promise<void>;

  export var map: <T>(
    tArray: T[],
    tMapper: (iItem: T, index: number) => T,
    options?: IChunkifyOptions
  ) => Promise<T[]>;

  export var reduce: <T, U>(
    tArray,
    tReducer: (memo: U, tItem: T, index: number, tArray: T[]) => U,
    options?: IChunkifyOptions,
    memo?: U
  ) => Promise<U>;


  ////////////
  // iteration
  export var interval: (
    indexConsumer: (index: number) => void,
    start: number,
    final: number,
    options?: IChunkifyOptions
  ) => Promise<void>;

  export var range: (
    indexConsumer: (index: number) => void,
    length: number,
    options?: IChunkifyOptions
  ) => Promise<void>;

  ////////////
  // generator
  export var generator: (
    start: number,
    final: number,
    options?: IChunkifyOptions
  ) => IterableIterator<number|IPause>;

}
