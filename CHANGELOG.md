# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [2.0.0 - 2.0.3] - 2015-09-21
### BREAKING CHANGES
* `chunkify.array` is now `chunkify.each`. The returned promise resolves with `undefined` instead of the original array.

### Added
#### `chunkify.map(Array array, Function fn, [Object options])`
Similar to `chunkify.each`, except the promise resolves with the array mapped via `fn`. 

New `options` parameter `scope`. This is an object on which `fn` is invoked on. The default value is `null`. 

`options` aliases:

* `delay`: `delaytime`, `yield`, `yieldtime`
* `chunk`: `chunksize`

## [1.0.0 - 1.0.5] - 2015-09-20
### Added
Initial release.