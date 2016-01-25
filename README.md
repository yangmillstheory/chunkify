# chunkify

[![Build Status](https://travis-ci.org/yangmillstheory/chunkify.svg?branch=master)](https://travis-ci.org/yangmillstheory/chunkify)

## What is it?

An API to prevent long-running scripts from blocking. 

The idea is to do work in synchronous chunks, periodically letting go of the thread. 

[Here it is in the browser](http://yangmillstheory.github.io/chunkify/), integrated with [Angular.js](https://angularjs.org/). 
 
## API

We'll use our [TypeScript declarations](chunkify.d.ts). 

### Options

In [API methods](#api), an options literal can be passed:

```javascript
declare interface IChunkifyOptions {
  // the number synchronously calls to make before yielding
  // default value is 10; must be positive
  chunk: number;  
  
  // the number of milliseconds to wait  until calling again
  // default value is 50; must be non-negative
  delay: number;
  
  // the context on which to invoke calls on
  // default value is null; must not be a Number, Boolean, or undefined
  scope?: Object;  
}
```

### Exports

#### **Core**

#### chunkify.generator

```javascript
export var generator: (
  start: number,
  final: number,
  options?: IChunkifyOptions
) => IterableIterator<number|IPause>;

declare interface IPause {
  resume(fn: () => void);
}
```

Returns the core [Generator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*) used to power everything else.
 
It yields integers from `start` and `final`. Values are yielded synchronously within intervals of length `chunk`. At every `chunk`<sup>th</sup> call to `.next()`, the generator yields a promise-like `IPause`, with a single method `.resume`. 

An error will be thrown if the generator is advanced before the `IPause` has `.resume`'d.  The pause resumes after `delay` milliseconds, given in `options` or using the default value.  

### **Arrays**

#### chunkify.each
```javascript
export var each: <T>(
  tArray: T[],
  tConsumer: (tItem: T, index: number) => void,
  options?: IChunkifyOptions
) => Promise<void>
```

#### chunkify.map
```javascript
export var map: <T>(
  tArray: T[],
  tMapper: (tItem: T, index: number) => T,
  options?: IChunkifyOptions
) => Promise<T[]>;
```
 
The `Promise` resolves with the mapped array.

#### chunkify.reduce

```javascript
export var reduce: <T, U>(
  tArray: T[],
  tReducer: (memo: U, tItem: T, index: number, tArray: T[]) => U,
  options?: IChunkifyOptions,
  memo?: U
) => Promise<U>;
```

Almost identical to the [native reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) on `Array.prototype`. Resolves with the reduction result.

#### Catching Errors

To catch any `Error` thrown during processing, attach a `.catch(...)` hook to the returned `Promise`.

The error object has the shape `{error, item, index}`, where `error` is the original error, index is the index where it happened, and item is `tArray[index]`. 

Processing halts when an `Error` is thrown.

### **Iteration**

#### chunkify.interval

```javascript
export var interval: (
  indexConsumer: (index: number) => void,
  start: number,
  final: number,
  options?: IChunkifyOptions
) => Promise<void>;
```

#### chunkify.range

```javascript
export var range: (
  indexConsumer: (index: number) => void,
  length: number,
  options?: IChunkifyOptions
) => Promise<void>;
```

This is the same as `chunkify.interval` with the `start` parameter set to `0`.

#### Catching Errors 
 
Just like catching errors in the Arrays API, except an `item` key isn't part of the error object. 

## Contributing

**Development is in TypeScript/ES6.**

Get the source:

    $ git clone git@github.com:username/chunkify

Install dependencies:
    
    $ npm i && npm i babel-polyfill && node_modules/.bin/tsd install
    
Compile:

    $ npm run-script compile
    
Develop:

    $ npm run-script dev

## License

MIT © 2016, Victor Alvarez