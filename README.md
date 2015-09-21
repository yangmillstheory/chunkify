# chunkify

An [ES6-developed](http://babeljs.io/) [node](https://nodejs.org/en/) module that prevents long-running scripts from blocking the JavaScript thread.

## Install

    $ npm install --save chunkify
    
## Usage

Import the module:

    import chunkify from 'chunkify'

## API

### chunkify.array(Array array, Function fn, [Object options])

`options` is an object literal that specifies a non-negative `delay` value, and a positive `chunk` value.

* `chunk` is the number of items in `array` to successively invoke `fn` on before yielding back to the main thread. Default is `1`.
* `delay` is the minimal time in milliseconds to wait before continuing to invoke `fn` on the next item in `array`. Default is `0`.

`fn` is successively invoked on `array`. At every `chunk`<sup>th</sup> invocation, control is given back to the main thread. After `delay` milliseconds, `fn` picks back up where it left off. This continues until all items in `array` have been processed. 
   
Returns a `Promise` that resolves with `array` when `fn` has been invoked on all items in `array`.

If any invocation of `fn` throws an error, the promise is rejected with an object `{error, item}`, where `error` is the caught `Error`, and `item` is the member of `array` where `fn(item)` threw. No further processing happens after the failure. 

## Future Plans

Expose a [generator-friendly](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*) API.
 
## Contributing

**Development is in `snake_case` ES6.**

Get the source.

    $ git clone git@github.com:yangmillstheory/chunkify

Install dependencies.
    
    $ npm install
    
Compile sources.

    $ node_modules/.bin/gulp build
    
Run tests.

    $ npm test

## License

MIT © 2015, Victor Alvarez