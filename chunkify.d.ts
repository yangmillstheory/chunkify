declare module 'chunkify' {
  /////////////////
  // core generator
  export var generator: (start: number, final: number, options?: IChunkifyOptions) => GeneratorFunction;
  
  /////////////////////////
  // functional programming
  export var each:   (array: any[], fn: Function, options?: IChunkifyOptions) => Promise<void>;  
  export var map:    (array: any[], fn: Function, options?: IChunkifyOptions) => Promise<any[]>;  
  export var reduce: (array: any[], fn: Function, options?: IChunkifyOptions) => Promise<any>;
  
  /////////
  // ranges  
  export var range:    (fn: Function, range: number, options?: IChunkifyOptions) => Promise<void>;  
  export var interval: (fn: Function, final: number, options?: IChunkifyOptions) => Promise<void>;  
}

//////////////
// API options
declare interface IChunkifyOptions {
  chunk?: number;
  delay?: number;
  scope?: Object;
}