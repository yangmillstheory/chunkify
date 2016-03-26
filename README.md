# chunkify

[![Build Status](https://travis-ci.org/yangmillstheory/chunkify.svg?branch=master)](https://travis-ci.org/yangmillstheory/chunkify)

## What is it?

An isomorphic API to prevent long-running scripts from blocking. 

The idea is to do work in synchronous chunks, periodically letting go of the thread. 

[Here it is in the browser](http://yangmillstheory.github.io/chunkify/), integrated with [Angular.js](https://angularjs.org/). 
 
## API

We'll use our [TypeScript declarations](chunkify.d.ts) for documentation. 

### Options

In API methods, an options literal can be passed:

```javascript
declare interface IChunkifyOptions {
  // The number of synchronous calls to make before yielding.
  // Default value is 10; must be positive.
  chunk: number;  
  
  // The number of milliseconds to wait until calling again.
  // Default value is 50; must be non-negative.
  delay: number;
  
  // The context on which to invoke calls on.
  // Default value is null; must not be a Number, Boolean, or undefined.
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
  resume: (fn: () => void) => IPause;
}
```

Returns the core [Generator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*) used to power everything else.
 
It yields integers from `start` and `final`. Values are yielded synchronously within intervals of length `chunk`. At every `chunk`<sup>th</sup> call to `.next()`, the generator yields a promise-like `IPause`, with a single method `.resume`. 

An error will be thrown if the generator is advanced before the `IPause` has `.resume`'d.  The pause resumes after `delay` milliseconds, which is given in `options` or using its default value.  

### **Arrays**

For chunking up functional work on arrays.

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
// This Promise resolves with the mapped array.
export var map: <T>(
  tArray: T[],
  tMapper: (tItem: T, index: number) => T,
  options?: IChunkifyOptions
) => Promise<T[]>;
```
 
#### chunkify.reduce

```javascript
// Virtually identical to the native reduce on Array.prototype. 
// This Promise resolves with the reduction result.
export var reduce: <T, U>(
  tArray: T[],
  tReducer: (current: U, tItem: T, index: number, tArray: T[]) => U,
  options?: IChunkifyOptions,
  memo?: U
) => Promise<U>;
```

#### Catching Errors

To catch any `Error` thrown during processing, attach a `.catch(...)` to the returned `Promise`.

The error object in `.catch(...)` has the shape 
```javascript
{error: Error, item: T, index: number}
```
where `error` is the original error, `index` is the index where it happened, and `item` is `tArray[index]`. 

Processing stops when this happens.

### **Iteration**

For chunking up work done in loops.

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
// This is the same as chunkify.interval 
// with the start parameter set to 0.
export var range: (
  indexConsumer: (index: number) => void,
  length: number,
  options?: IChunkifyOptions
) => Promise<void>;
```

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
