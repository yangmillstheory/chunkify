import 'babel-polyfill';
import chunkify from '../../dist';
import angular from 'angular';
import _ from 'lodash';
import $ from 'jquery';
import 'jquery-ui/progressbar';
import 'jquery-ui/tooltip';


let randomInteger = (options = {}) => {
  let {max, min} = _.defaults(options, {
    max: Math.pow(10, 2),
    min: Math.pow(10, 2) * .75
  });
  return Math.floor(Math.random() * (max - min) + min);
};

angular
.module('chunkify-demo', [])
.controller('ChunkifyCtrl', ['$scope', '$timeout', ($scope, $timeout) => {
  const RANGE = _.range(0.5 * Math.pow(10, 5));
  const DEFAULT_CHUNK = 100;
  const DEFAULT_DELAY = 50;

  $scope.experiment = _.defaults({}, {
    progress: 0,
    range: RANGE.length,
    chunk: DEFAULT_CHUNK,
    delay: DEFAULT_DELAY,
    options() {
      return {delay: this.delay, chunk: this.chunk}
    }
  });

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

    state: {
      chunkified: true,
      selected: null
    },

    selected(action) {
      return this.state.selected === action
    },

    select(action) {
      this.state.selected = action
    },

    progress(value) {
      if (_.isNumber(value)) {
        $scope.experiment.progress = value
      } else {
        $scope.experiment.progress += 1
      }
    },

    simulateWork(index) {
      $timeout(() => { this.progress(); });
      let i = 0;
      while (i < randomInteger()) {
        i++
      }
      return index
    },

    _cleanOptions(options) {
      // currently a no-op
      return options;
    },

    _beforeAction(action, options = {}) {
      this.select(action);
      $scope.buttons.disable();
      return this._cleanOptions(options);
    },

    _afterAction(promise) {
      promise.then((value) => {
        $timeout(() => {
          this.progress(0);
          $scope.buttons.enable();
        }, 1000);
      });
    },

    _reduce() {
      let reducer = (memo, item, index) => {
        return memo + this.simulateWork(index);
      };
      let memo = 0;
      if (this.state.chunkified) {
        return chunkify.reduce(RANGE, reducer, _.extend({memo}, $scope.experiment.options()))
      } else {
        return Promise.resolve(RANGE.reduce(reducer, memo))
      }
    },

    _map() {
      let mapper = (item, index) => {
        return this.simulateWork(index) + 1
      };
      if (this.state.chunkified) {
        return chunkify.map(RANGE, mapper, $scope.experiment.options())
      } else {
        return Promise.resolve(RANGE.map(mapper))
      }
    },

    _each() {
      let eachFn = (index) => {
        this.simulateWork(index)
      };
      if (this.state.chunkified) {
        return chunkify.each(RANGE, eachFn, $scope.experiment.options())
      } else {
        return Promise.resolve(RANGE.forEach(eachFn))
      }
    },

    _range() {
      let loopFn = (index) => {
        this.simulateWork(index)
      };
      if (this.state.chunkified) {
        return chunkify.range(loopFn, RANGE.length, $scope.experiment.options())
      } else {
        return Promise.resolve(this._blockingRange(loopFn))
      }
    },

    _blockingRange(loopFn) {
      for (let index = 0; index < RANGE.length; index++) {
        loopFn(index)
      }
    }

  };

  // some metaprogramming to avoid boilerplate
  for (let action of $scope.actions.names) {
    $scope.actions[action] = _.compose(promise => {
      $scope.actions._afterAction(promise);
    }, options => {
      return $scope.actions[`_${action}`](options)
    }, options => {
      return $scope.actions._beforeAction(action, options);
    });
  }
}])
.directive('wisp', ['$interval', ($interval) => {
  function* shiftsGenerator($element, $parent) {
    let shifts_index = 0;
    let randomHorizontalOffset = () => {
      let width = $parent.width();
      return randomInteger({min: 0.25 * width, max: width});
    };
    let randomVerticalOffset = () => {
      let height = $parent.height();
      return randomInteger({min: 0.25 * height, max: height});
    };
    let shifts = [
      () => {
        let maxHorizontalOffset = ($parent.offset().left + $parent.width()) -
          ($element.offset().left + $element.width());
        return {
          left: `+=${Math.min(randomHorizontalOffset(), maxHorizontalOffset)}`
        }
      },
      () => {
        let maxVerticalOffset = ($parent.offset().top + $parent.height()) -
          ($element.offset().top + $element.height());
        return {
          top: `+=${Math.min(randomVerticalOffset(), maxVerticalOffset)}`
        }
      },
      () => {
        let maxHorizontalOffset = $element.offset().left - $parent.offset().left;
        return {
          left: `-=${Math.min(randomHorizontalOffset(), maxHorizontalOffset)}`}
      },
      () => {
        let maxVerticalOffset = $element.offset().top - $parent.offset().top;
        return {
          top: `-=${Math.min(randomVerticalOffset(), maxVerticalOffset)}`
        }
      }
    ];
    let length = shifts.length;
    while (true) {
      yield shifts[randomInteger({min: 0, max: length})]();
    }
  }
  return {
    replace: true,
    link(scope, element) {
      let $element = $(element);
      let $parent = $element.parent();
      let shifts = shiftsGenerator($element, $parent);
      var animate = (transparent = false) => {
        let css = shifts.next().value;
        if (transparent) {
          _.extend(css, {opacity: 0.5})
        } else {
          _.extend(css, {opacity: 1})
        }
        $element.animate(css, 400, animate.bind(null, !transparent));
      };
      animate();
    },
    template: '<div id="wisp"></div>'
  }
}])

.directive('wispContainer', ['$window', ($window) => {
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    scope: {},
    link(scope, element, attrs) {
      const min_width = parseInt(attrs.minWidth);
      const min_height = parseInt(attrs.minHeight);
      let $element = $(element);
      let resize = () => {
        let width = Math.max($(window).width() - 250, min_width);
        let height = Math.max($(window).height() - 225, min_height);
        $element.css({width, height});
        return true
      };
      resize() && ($window.onresize = resize);
    },
    template: `<div class='wisp-container' ng-transclude></div>`
  }
}])
.directive('actionCode', () => {
    return {
      restrict: 'E',
      scope: {
        state: '=',
        chunk: '=',
        delay: '='
      },
      link(scope, element) {
        $(element).find('.action-code').css({
          width: '100%',
          height: '100%'
        });
      },
      template:
        `<div class="action-code">
          <pre>
// <strong>chunkified</strong> actions keep the animation active.
// un-checking <strong>chunkified</strong> will cause actions to momentarily lock your browser.

const RANGE = _.range(0.5 * Math.pow(10, 5));
<strong>let chunk = {{chunk}};</strong>
<strong>let delay = {{delay}};</strong>
let simulateWork = (index) => {
  let i = 0;
  while (i < randomInteger()) {
    i++
  }
  return index
};
          </pre>
          <pre>
            {{state | code}}
          </pre>
        </div>`
    }
})
.filter('code', () => {
  const code_by_action = {
    map(chunkified = false) {
      let setup = `
let mapper = (item, index) => {
  return simulateWork(index) + 1
};`;
      if (chunkified) {
        return `
${setup}
return chunkify.map(RANGE, mapper, {chunk, delay})`
      } else {
        return `
${setup}
return RANGE.map(mapper))`
      }
    },
    reduce(chunkified = false) {
      let setup = `
let reducer = (memo, item, index) => {
  return memo + simulateWork(index);
};
let memo = 0;`;
      if (chunkified) {
        return `
${setup}
return chunkify.reduce(RANGE, reducer, {memo, chunk, delay})`;
      } else {
        return `
${setup}
return RANGE.reduce(reducer, memo)`;
      }
    },
    each(chunkified = false) {
      let setup = `
let eachFn = (index) => {
  simulateWork(index)
};`;
      if (chunkified) {
        return `
${setup}
return chunkify.each(RANGE, eachFn, {chunk, delay})`
      } else {
        return `
${setup}
return RANGE.forEach(eachFn)`
      }
    },
    range(chunkified = false) {
      let setup = `
let loopFn = (index) => {
  simulateWork(index)
};`;
      if (chunkified) {
        return `
${setup}
return chunkify.range(loopFn, RANGE.length, {chunk, delay})`
      } else {
        return `
${setup}
for (let index = 0; index < RANGE.length; index++) {
  loopFn(index)
}`
      }
    }
  };
  return state => {
    if (state.selected === null) {
      return `
Hover over an action button on the left sidebar.`
    } else {
      let {selected, chunkified} = state;
      return `
// action: ${selected}
// chunkified: ${chunkified}
${code_by_action[selected](chunkified)}
`
    }
  };
})
.directive('experiment', () => {
  return {
    scope: {
      state: '=',
      disable: '&',
      enable: '&'
    },
    link(scope) {
      scope.iterations = {
        label: 'Iterations',
        value: scope.state.progress
      };
      scope.chunk = {
        min: 50,
        max: 1000,
        label: 'chunk size'
      };
      scope.delay = {
        min: 10,
        max: 100,
        label: 'delay time'
      };
      scope.inputs = {
        initialChunk: scope.state.chunk,
        initialDelay: scope.state.delay,
        disabled: false,
        reset() {
          if (!scope.state.progress) {
            scope.state.chunk = this.initialChunk;
            scope.state.delay = this.initialDelay;
          }
        }
      }
      ;
      scope.$watch('state', (state, prev) => {
        if (prev.chunk !== state.chunk || prev.delay !== state.delay) {
          if (scope.form.$valid) {
            scope.enable()
          } else {
            scope.disable()
          }
        }
        if (state.progress) {
          scope.iterations.value = state.progress;
          scope.inputs.disabled = true;
        } else {
          scope.iterations.value = 0;
          scope.inputs.disabled = false;
        }
      }, true);
    },
    template:
      `<div class="blurb">
        <dl>
          <section>
            <dt>{{iterations.label}}</dt>
            <dd>{{iterations.value}}</dd>
          </section>
        </dl>
        <form name="form">
          <section>
            <label for="chunk">chunk size</label>
            <input class="form-control" type="number" required ng-disabled="inputs.disabled"
                   name="chunk" min="{{chunk.min}}" max="{{chunk.max}}" ng-model="state.chunk" />
          </section>
          <section>
            <label for="delay">delay time</label>
            <input class="form-control" type="number" required ng-disabled="inputs.disabled"
                   name="delay" min="{{delay.min}}" max="{{delay.max}}" ng-model="state.delay" />
          </section>
          <a ng-click="inputs.reset()">reset</a>
        </form>
      </div>`
  }
})
.directive('progressbar', () => {
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
        value: 0
      });
      var progress = value => {
        $bar.progressbar('option', 'value', value)
      };
      scope.$watch('progress', progress);
    },
    template:
      `<div class="progressbar-container">
        <div id="progressbar"></div>
      </div>`
  }
})
.filter('titlecase', () => {
   return word => {
     return `${word.charAt(0).toUpperCase()}${word.slice(1)}`
   }
});

