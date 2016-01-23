//////////////
// API options
declare interface IChunkifyOptions {
  chunk?: number;
  delay?: number;
  scope?: Object;
}

declare interface IReduceOptions<T> extends IChunkifyOptions {
  memo?: T
}

declare interface IReducer<T, U> extends Function {
  (memo: U, item: T, index: number, array: T[]): U;
}

declare interface IMapper<T> extends Function {
  (item: T): T;
}

/////////////
// generator
declare interface IChunkifyGenerator {
  (start: number, final: number, options?: IChunkifyOptions): IterableIterator<number | Promise<void>>;
}

declare module 'chunkify' {
  
  
  
  /////////////////////////
  // functional programming
  export interface each<T> {
    (array: T[], iterator: Function, options?: IChunkifyOptions): Promise<void>;
  }
  export interface map<T> {
    (array: T[], mapper: IMapper<T>, options?: IChunkifyOptions): Promise<T[]>; 
  }  
  export interface reduce<T, U> {
    (array: T[], reducer: IReducer<T, U>, options?: IReduceOptions<T>): Promise<U>; 
  }
  
  ////////////
  // iteration  
  export var range:    (fn: Function, range: number, options?: IChunkifyOptions) => Promise<void>;  
  export var interval: (fn: Function, final: number, options?: IChunkifyOptions) => Promise<void>;  
}
