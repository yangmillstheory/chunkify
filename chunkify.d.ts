declare module 'chunkify' {
  //////////////
  // API options
  export interface IOptions {
    chunk?: number;
    delay?: number;
    scope?: Object;
  }
  
  /////////////////
  // core generator
  export var generator: (start: number, final: number, options?: IOptions) => GeneratorFunction;
  
  /////////////////////////
  // functional programming
  export var each:   (array: any[], fn: Function, options?: IOptions) => Promise<void>;  
  export var map:    (array: any[], fn: Function, options?: IOptions) => Promise<any[]>;  
  export var reduce: (array: any[], fn: Function, options?: IOptions) => Promise<any>;
  
  /////////
  // ranges  
  export var range:    (fn: Function, range: number, options?: IOptions) => Promise<void>;  
  export var interval: (fn: Function, final: number, options?: IOptions) => Promise<void>;  
}