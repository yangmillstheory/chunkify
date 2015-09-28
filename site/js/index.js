'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _dist = require('../../dist');

var _dist2 = _interopRequireDefault(_dist);

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

console.log(_dist2['default']);
console.log(_angular2['default']);

_angular2['default'].module('chunkify-demo', []).controller('ChunkifyCtrl', function ($scope) {

  $scope.buttons = {
    disabled: false
  };

  $scope.chunked = {
    reduce: function reduce() {
      console.log('chunked reduce');
    },
    map: function map() {
      console.log('chunked map');
    },
    each: function each() {
      console.log('chunked each');
    },
    loop: function loop() {
      console.log('chunked loop');
    }
  };

  $scope.regular = {
    reduce: function reduce() {
      console.log('regular reduce');
    },
    map: function map() {
      console.log('regular map');
    },
    each: function each() {
      console.log('regular each');
    },
    loop: function loop() {
      console.log('regular loop');
    }
  };
});