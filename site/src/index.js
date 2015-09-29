import chunkify from '../../dist'
import angular from 'angular'
import _ from 'underscore'
import $ from 'jquery'


angular
.module('chunkify-demo', [])
.controller('ChunkifyCtrl', function($scope) {
  const RANGE = _.range(0.5 * Math.pow(10, 6));
  let blocking = () => {
    let i = 0;
    while (i < Math.pow(10, 3)) {
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

    _clean_options(options) {
      _.defaults(options, {chunkify: false});
    },

    _before_action(options = {}) {
      this._clean_options(options);
      $scope.buttons.disable();
      return options
    },

    _after_action(promise) {
      promise.then((value) => {
        $scope.buttons.enable();
        $scope.$digest();
      });
    },

    _reduce(options) {
      let reducer = (memo, item) => {
        blocking();
        return memo + item
      };
      let memo = 0;
      if (options.chunkify) {
        return chunkify.reduce(RANGE, reducer, {memo, chunk: 2500, delay: 10})
      } else {
        //return Promise.resolve(RANGE.reduce(reducer, memo))
        return Promise.resolve(RANGE.reduce(reducer, memo))
      }
    },

    _map(options) {
      let mapper = (item) => {
        blocking();
        return item + 1
      };
      if (options.chunkify) {
        return chunkify.map(RANGE, mapper, {chunk: 2500, delay: 10})
      } else {
        return Promise.resolve(RANGE.map(mapper))
      }
    },

    _each(options) {
      console.log('chunk each');
      return new Promise(resolve => setTimeout(resolve, 3000));
    },

    _loop(options) {
      console.log('chunk loop');
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
.directive('animation', function($interval, $window) {
  return {
    replace: true,
    link: function(scope, element) {
      const duration = 1000;
      const cssprops = {
        'background-color': '#34495e',
        'border-radius': '6px',
        'margin': '50px auto',
        'width': $($window).width() - 300,
        'height': $($window).height() - 300
      };
      let $element = $(element);
      $element.css(cssprops);
      var animate = shrink => {
        let complete = () => {
          animate(!shrink);
        };
        var css;
        if (shrink) {
          css = {width: cssprops.width/2, height: cssprops.height/2};
        } else {
          css = {width: cssprops.width, height: cssprops.height};
        }
        $element.animate(css, duration, complete);
      };
      animate(true);
    },

    template: '<div class="animation"></div>'
  }
});

