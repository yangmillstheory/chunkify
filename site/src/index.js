import chunkify from '../../dist'
import angular from 'angular'
import _ from 'underscore'
import $ from 'jquery'


angular
.module('chunkify-demo', [])
.controller('ChunkifyCtrl', ($scope) => {
  const RANGE = _.range(0.5 * Math.pow(10, 6));
  let simulate_work = () => {
    let random_integer = () => {
      let max = Math.pow(10, 3);
      let min = Math.pow(10, 3) * .75;
      return Math.random() * (max - min) + min;
    };
    let i = 0;
    while (i < random_integer()) {
      i++
    }
  };

  $scope.buttons = {
    disabled: false,

    disable: function() {
      this.disabled = true;
    },

    enable: function() {
      this.disabled = false;
    }
  };

  $scope.actions = {

    names: ['map', 'reduce', 'each', 'loop'],

    chunkify: false,

    _clean_options(options) {
      // currently a no-op
      return options;
    },

    _before_action(options = {}) {
      $scope.buttons.disable();
      return this._clean_options(options);
    },

    _after_action(promise) {
      promise.then((value) => {
        $scope.buttons.enable();
        $scope.$digest();
      });
    },

    _reduce() {
      let reducer = (memo, item) => {
        simulate_work();
        return memo + item
      };
      let memo = 0;
      if ($scope.actions.chunkify) {
        return chunkify.reduce(RANGE, reducer, {memo, chunk: 1000, delay: 10})
      } else {
        return Promise.resolve(RANGE.reduce(reducer, memo))
      }
    },

    _map() {
      let mapper = (item) => {
        simulate_work();
        return item + 1
      };
      if ($scope.actions.chunkify) {
        return chunkify.map(RANGE, mapper, {chunk: 1000, delay: 10})
      } else {
        return Promise.resolve(RANGE.map(mapper))
      }
    },

    _each() {
      return new Promise(resolve => setTimeout(resolve, 3000));
    },

    _loop() {
      return new Promise(resolve => setTimeout(resolve, 5000));
    }

  };

  // some metaprogramming to avoid boilerplate
  for (let method of $scope.actions.names) {
    $scope.actions[method] = _.compose(promise => {
      $scope.actions._after_action(promise);
    }, options => {
      return $scope.actions[`_${method}`](options)
    }, options => {
      return $scope.actions._before_action(options);
    });
  }

})
// Fills parent with a fixed number of cells.
//
//  On resize, resizes those cells too.
.directive('animationGrid', ($interval, $window) => {
  return {
    replace: true,
    link: function(scope, element) {
      let $parent = $(element).parent();
      let resize = () => {
        $parent.css({
          width: $window.innerWidth - 200,
          height: $window.innerHeight - 250
        })
      };
      resize();
      $window.onresize = resize
    },
    template: '<div class="animation"></div>'
  }
})
.filter('titlecase', () => {
   return word => {
     return `${word.charAt(0).toUpperCase()}${word.slice(1)}`
   }
});

