# chunkify

[![Build Status](https://travis-ci.org/yangmillstheory/chunkify.svg?branch=master)](https://travis-ci.org/yangmillstheory/chunkify)

An [ES6-developed](http://babeljs.io/) functional API that prevents long-running scripts from blocking the JavaScript thread.
 
## Introduction

This is an API for getting long-running JavaScripts to periodically unblock the thread. The idea is to use timeouts to chunk up work and let the call stack unwind. Here's a [demo](http://yangmillstheory.github.io/chunkify/) of the code being used on the browser.
 
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

### ***Core API***

#### chunkify.generator(Number start, Number final, Object options)</a>

Returns the core [Generator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*) used internally. Thus, this is somewhat more unstable than other API methods.
 
`options` may specify `delay` and `chunk`, as [above](#options).
 
The generator yields integers from the range `start` and `final`, inclusive. Values are yielded synchronously within intervals of length `chunk`. At every `chunk`<sup>th</sup> call to `.next()`, the generator yields a `Promise` that represents a paused and non-blocking state - this is what unblocks the thread. 

This promise resolves after at least `delay` milliseconds; an error will be thrown in case the generator is advanced again before this `Promise` has resolved. Further calls to `.next()` may be resumed after resolution. This process can continue until all integers between `start` and `final` have been yielded.

### ***Arrays***

#### <a name='each'>chunkify.each(Array array, Function fn, [Object options])</a>

`options` can specify all of the properties mentioned in [options](#options).

`fn` is invoked in synchronous chunks on successive `array` elements and their indices (`fn(item, index)`).  
   
Returns a `Promise` that resolves with `undefined` when `fn` has been invoked on all items in `array`.

#### chunkify.map(Array array, Function fn, [Object options])
 
Identical to [chunkify.each](#each), except the returned `Promise` resolves with the `array` mapped by `fn`.

#### chunkify.reduce(Array array, Function fn, [Object options])

`options` can specify all of the properties mentioned in [options](#options), plus a `memo` value which will be used as the reduction memo as in the [native reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) on `Array.prototype`.
 
The behavior is just like `Array.prototype.reduce`, but the work is chunked up as [above](#each), and the returned `Promise` resolves with the result of the reduction.

**If any invocation of `fn` throws an `Error`, the returned promise is rejected with an object `{error, item, index}`, where `error` is the caught `Error`, `index` is the index in `array` where the invocation threw, and `item` is `array[index]`. No further processing happens after the failure.**

### ***Ranges***

#### <a name='interval'>chunkify.interval(Function fn, Number final, [Object options])</a>

`options` can specify all of the properties mentioned in [options](#options), along with a numerical `start` value that must be less than or equal to `final`. By default, `options.start` is `0`.

Invoke `fn` synchronously in chunks from the interval `options.start` to `final`.  

Returns a `Promise` that resolves with `undefined` when the entire interval has been traversed.  

#### chunkify.range(Function fn, Number range, [Object options])

Like [chunkify.interval](#interval), with `options.start` forced to `0`. 
 
**If any invocation of `fn` throws an `Error`, the returned promise is rejected with an object `{error, index}`, where `error` is the caught `Error` and `index` is the index in `array` where the invocation threw. No further processing happens after the failure.**

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