import chunkify from '../../dist'
import angular from 'angular'

console.log(chunkify);
console.log(angular);


angular
.module('chunkify-demo', [])
.controller('ChunkifyCtrl', ($scope) => {

    $scope.buttons = {
      disabled: false
    };

    $scope.chunked = {
      reduce: function() {
        console.log('chunked reduce')
      },
      map: function() {
        console.log('chunked map')
      },
      each: function() {
        console.log('chunked each')
      },
      loop: function() {
        console.log('chunked loop')
      }
    };

    $scope.regular = {
      reduce: function() {
        console.log('regular reduce')
      },
      map: function() {
        console.log('regular map')
      },
      each: function() {
        console.log('regular each')
      },
      loop: function() {
        console.log('regular loop')
      }
    };

});