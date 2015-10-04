import chunkify from '../../dist'
import angular from 'angular'
import Spinner from 'spin.js'
import _ from 'underscore'
import $ from 'jquery'


let random_integer = (options = {}) => {
  let {max, min} = _.defaults(options, {
    max: Math.pow(10, 2),
    min: Math.pow(10, 2) * .75
  });
  return Math.random() * (max - min) + min;
};

angular
.module('chunkify-demo', [])
.controller('ChunkifyCtrl', ($scope) => {
  const RANGE = _.range(0.5 * Math.pow(10, 5));
  const CHUNK = 100;
  const DELAY = 10;
  let simulate_work = () => {
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

    names: ['map', 'reduce', 'each', 'range'],

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
      let reducer = (memo, item, index) => {
        simulate_work();
        return memo + item
      };
      let memo = 0;
      if ($scope.actions.chunkify) {
        return chunkify.reduce(RANGE, reducer, {memo, chunk: CHUNK, delay: DELAY})
      } else {
        return Promise.resolve(RANGE.reduce(reducer, memo))
      }
    },

    _map() {
      let mapper = (item, index) => {
        simulate_work();
        return item + 1
      };
      if ($scope.actions.chunkify) {
        return chunkify.map(RANGE, mapper, {chunk: CHUNK, delay: DELAY})
      } else {
        return Promise.resolve(RANGE.map(mapper))
      }
    },

    _each() {
      return new Promise(resolve => setTimeout(resolve, 3000));
    },

    _range() {
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
.directive('animation', ($interval, $window) => {
  const intial_css = {
    'background-color': '#4d63bc',
    'border-radius': '25px',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '25px',
    height: '25px',
    opacity: .8
  };
  function* shifts_generator($element, $parent) {
    let shifts_index = 0;
    let random_left = () => {
      return random_integer({min: 0, max: $parent.width()});
    };
    let random_top = () => {
      return random_integer({min: 0, max: $parent.height()});
    };
    let shifts = [
      () => {
        return {
          left: `+=${Math.min(random_left(), ($parent.offset().left + $parent.width()) - $element.offset().left)}`
        }
      },
      () => {
        return {
          top: `+=${Math.min(random_top(), ($parent.offset().top + $parent.height()) - $element.offset().top)}`
        }
      },
      () => {
        return {
          left: `-=${Math.min(random_left(), $element.offset().left - $parent.offset().left)}`}
      },
      () => {
        return {
          top: `-=${Math.min(random_top(), $element.offset().top - $parent.offset().top)}`
        }
      }
    ];
    let length = shifts.length;
    while (true) {
      yield shifts[shifts_index++]();
      if (shifts_index % length === 0) {
        shifts_index = 0;
      }
    }
  }
  return {
    replace: true,
    link: function(scope, element) {
      let $element = $(element).css(intial_css);
      let $parent = $element.parent();
      let resize = () => {
        let width = $window.innerWidth - 200;
        let height = $window.innerHeight - 250;
        $parent.css({width, height});
        return true
      };
      resize() && ($window.onresize = resize);
      let shifts = shifts_generator($element, $parent);
      var animate = () => {
        $element.animate(shifts.next().value, 'slow', animate);
      };
      animate();
    },
    template: '<div id="animation"></div>'
  }
})
.filter('titlecase', () => {
   return word => {
     return `${word.charAt(0).toUpperCase()}${word.slice(1)}`
   }
});

