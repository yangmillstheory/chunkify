# chunkify

[![Build Status](https://travis-ci.org/yangmillstheory/chunkify.svg?branch=master)](https://travis-ci.org/yangmillstheory/chunkify)

An [ES6-developed](http://babeljs.io/) functional API that prevents long-running scripts from blocking the JavaScript thread.
 
## Introduction

This is an API for getting long-running JavaScripts to periodically unblock the thread. The idea is to use timeouts to chunk up work and let the call stack unwind.
 
## Install

    $ npm install --save chunkify
    
## Usage

Import the module:

    import chunkify from 'chunkify'
    
## <a name='options'>Options

In [API methods](#api), an optional `options` object may provide any subset of the following data:

* `chunk`: the number times to successively invoke `fn` before yielding control of the main thread. 
    * default value is `1`
    * must be positive
    * aliases: `chunksize`
* `delay`: the minimal time in milliseconds to wait before continuing to invoke `fn`.
    * default value is `0`
    * must be non-negative
    * aliases: `yield`, `yieldtime`, `delaytime`
* `scope`: the object on which `fn` is invoked on.  
    * default value is `null`
    * must not be a `Number`, `Boolean`, or `undefined`

## <a name='api'>API

### ***Arrays***

### <a name='each'>chunkify.each(Array array, Function fn, [Object options])</a>

`fn` is invoked on successive `array` elements and their indices (`fn(item, index)`).  
   
Returns a `Promise` that resolves with `undefined` when `fn` has been invoked on all items in `array`.

### chunkify.map(Array array, Function fn, [Object options])
 
Identical to [chunkify.each](#each), except the returned `Promise` resolves with the `array` mapped by `fn`.

### chunkify.reduce(Array array, Function fn, [Object options])
 
Exactly like the [native reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) on `Array.prototype`, but the work is chunked up as [above](#each), and the returned promise resolves with the result of the reduction.

**If any invocation of `fn` throws an `Error`, the returned promise is rejected with an object `{error, item, index}`, where `error` is the caught `Error`, `index` is the index in `array` where the invocation threw, and `item` is `array[index]`. No further processing happens after the failure.**

### ***Loops***

### <a name='range'>chunkify.range(Function fn, Number final, [Object options])</a>

Invoke `fn` in chunks from the range `options.start` to `final`. If `options.start` is given, it must be a `Number` less than or equal to `final`. Its default value is `0`. 

### chunkify.loop(Function fn, Number range, [Object options])

Like [chunkify.range](#range), with `options.start` forced to `0`. 
 
**If any invocation of `fn` throws an `Error`, the promise is rejected with an object `{error, index}`, where `error` is the caught `Error` and `index` is the index in `array` where the invocation threw. No further processing happens after the failure.**

## Contributing

**Development is in `snake_case` ES6.**

Get the source.

    $ git clone git@github.com:yangmillstheory/chunkify

Install dependencies.
    
    $ npm install
    
Compile sources.

    $ node_modules/.bin/gulp
    
Run tests.

    $ npm test

## License

MIT © 2015, Victor Alvarez