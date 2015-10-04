import chunkify from '../../dist'
import angular from 'angular'
import Spinner from 'spin.js'
import _ from 'underscore'
import $ from 'jquery'
import 'jquery-ui/progressbar'
import 'jquery-ui/tooltip'


let random_integer = (options = {}) => {
  let {max, min} = _.defaults(options, {
    max: Math.pow(10, 2),
    min: Math.pow(10, 2) * .75
  });
  return Math.random() * (max - min) + min;
};

angular
.module('chunkify-demo', [])
.controller('ChunkifyCtrl', ['$scope', '$timeout', ($scope, $timeout) => {
  const RANGE = _.range(0.5 * Math.pow(10, 5));
  const CHUNK = 100;
  const DELAY = 10;

  $scope.experiment = {
    length: RANGE.length,
    chunk: CHUNK,
    delay: DELAY
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

    progress_data: {value: 0, max: $scope.experiment.length},

    progress() {
      this.progress_data.value += 1
    },

    simulate_work(index) {
      $timeout(() => { this.progress(); });
      let i = 0;
      while (i < random_integer()) {
        i++
      }
      return index
    },

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
        $timeout(() => {
          $scope.actions.progress_data.value = 0;
          $scope.buttons.enable();
        }, 1000);
      });
    },

    _reduce() {
      let reducer =(memo, item, index) => {
        return memo + this.simulate_work(index);
      };
      let memo = 0;
      if (this.chunkify) {
        return chunkify.reduce(RANGE, reducer, {memo, chunk: CHUNK, delay: DELAY})
      } else {
        return Promise.resolve(RANGE.reduce(reducer, memo))
      }
    },

    _map() {
      let mapper = (item, index) => {
        return this.simulate_work(index) + 1
      };
      if (this.chunkify) {
        return chunkify.map(RANGE, mapper, {chunk: CHUNK, delay: DELAY})
      } else {
        return Promise.resolve(RANGE.map(mapper))
      }
    },

    _each() {
      let each_fn = (index) => {
        this.simulate_work(index)
      };
      if (this.chunkify) {
        return chunkify.each(RANGE, each_fn, {chunk: CHUNK, delay: DELAY})
      } else {
        return Promise.resolve(RANGE.forEach(each_fn))
      }
    },

    _range() {
      let loop_fn = (index) => {
        this.simulate_work(index)
      };
      if (this.chunkify) {
        return chunkify.range(loop_fn, RANGE.length, {chunk: CHUNK, delay: DELAY})
      } else {
        return Promise.resolve(this._blocking_range(loop_fn))
      }
    },

    _blocking_range(loop_fn) {
      for (let index = 0; index < RANGE.length; index++) {
        loop_fn(index)
      }
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

}])
.directive('animation', ['$interval', '$window', ($interval, $window) => {
  const intial_css = {
    'background-color': '#4d63bc',
    'border-radius': '100px',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100px',
    height: '100px'
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
          left: `+=${Math.min(random_left(), ($parent.offset().left + $parent.width()) - ($element.offset().left + $element.width()))}`
        }
      },
      () => {
        return {
          top: `+=${Math.min(random_top(), ($parent.offset().top + $parent.height()) - ($element.offset().top + $element.height()))}`
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
    link(__, element) {
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
      var animate = (transparent = false) => {
        let css = shifts.next().value;
        if (transparent) {
          _.extend(css, {opacity: 0.5})
        } else {
          _.extend(css, {opacity: 1})
        }
        $element.animate(css, 'slow', animate.bind(null, !transparent));
      };
      animate();
    },
    template: '<div id="animation"></div>'
  }
}])
.directive('chunkifyInfo', () => {
  return {
    scope: {
      experiment: '='
    },
    link(scope) {
      scope.table = {
        data: [
          {label: 'Iters', value: scope.experiment.length},
          {label: 'Chunk', value: scope.experiment.chunk},
          {label: 'Delay', value: `${scope.experiment.delay} ms`}
        ]
      }
    },
    template: '<div class="blurb">' +
      '<dl>' +
        '<section ng-repeat="data in table.data">' +
          '<dt>{{data.label}}</dt>' +
          '<dd>{{data.value}}</dd>' +
        '</section>' +
      '</dl>' +
      '<p>' +
        'Turning <strong>chunkify</strong> on keeps the animation active.' +
      '</p>' +
    '</div>'
  }
})
.directive('progressbar', ['$timeout', $timeout => {
  return {
    restrict: 'E',
    scope: {
      progress: '=progress',
      max: '=max'
    },
    link(scope, element) {
      let $element = $(element);
      let $bar = $element.find('#progressbar').eq(0).progressbar({
        max: scope.max,
        value: 0,
        complete() {
          if (scope.progress > 0) {
            scope.progress = 0;
            scope.$digest()
          }
        }
      });
      var progress = value => {
        $bar.progressbar('option', 'value', value)
      };
      scope.$watch('progress', progress);
      $element.tooltip({
        position: {
          my: 'left+115 top-25'
        }
      })
    },
    template:
      '<div class="progressbar-container" title="{{progress}} of {{max}} iterations processed">' +
        '<div id="progressbar"></div>' +
      '</div>'
  }
}])
.filter('titlecase', () => {
   return word => {
     return `${word.charAt(0).toUpperCase()}${word.slice(1)}`
   }
});

