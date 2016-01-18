'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _dist = require('../../dist');

var _dist2 = _interopRequireDefault(_dist);

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

require('jquery-ui/progressbar');

require('jquery-ui/tooltip');

var random_integer = function random_integer() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _$defaults = _lodash2['default'].defaults(options, {
    max: Math.pow(10, 2),
    min: Math.pow(10, 2) * .75
  });

  var max = _$defaults.max;
  var min = _$defaults.min;

  return Math.floor(Math.random() * (max - min) + min);
};

_angular2['default'].module('chunkify-demo', []).controller('ChunkifyCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
  var RANGE = _lodash2['default'].range(0.5 * Math.pow(10, 5));
  var DEFAULT_CHUNK = 100;
  var DEFAULT_DELAY = 50;

  $scope.experiment = _lodash2['default'].defaults({}, {
    progress: 0,
    range: RANGE.length,
    chunk: DEFAULT_CHUNK,
    delay: DEFAULT_DELAY,
    options: function options() {
      return { delay: this.delay, chunk: this.chunk };
    }
  });

  $scope.buttons = {
    disabled: false,

    disable: function disable() {
      this.disabled = true;
    },

    enable: function enable() {
      this.disabled = false;
    }
  };

  $scope.actions = {

    names: ['map', 'reduce', 'each', 'range'],

    state: {
      chunkified: true,
      selected: null
    },

    selected: function selected(action) {
      return this.state.selected === action;
    },

    select: function select(action) {
      this.state.selected = action;
    },

    progress: function progress(value) {
      if (_lodash2['default'].isNumber(value)) {
        $scope.experiment.progress = value;
      } else {
        $scope.experiment.progress += 1;
      }
    },

    simulate_work: function simulate_work(index) {
      var _this = this;

      $timeout(function () {
        _this.progress();
      });
      var i = 0;
      while (i < random_integer()) {
        i++;
      }
      return index;
    },

    _clean_options: function _clean_options(options) {
      // currently a no-op
      return options;
    },

    _before_action: function _before_action(action) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      this.select(action);
      $scope.buttons.disable();
      return this._clean_options(options);
    },

    _after_action: function _after_action(promise) {
      var _this2 = this;

      promise.then(function (value) {
        $timeout(function () {
          _this2.progress(0);
          $scope.buttons.enable();
        }, 1000);
      });
    },

    _reduce: function _reduce() {
      var _this3 = this;

      var reducer = function reducer(memo, item, index) {
        return memo + _this3.simulate_work(index);
      };
      var memo = 0;
      if (this.state.chunkified) {
        return _dist2['default'].reduce(RANGE, reducer, _lodash2['default'].extend({ memo: memo }, $scope.experiment.options()));
      } else {
        return Promise.resolve(RANGE.reduce(reducer, memo));
      }
    },

    _map: function _map() {
      var _this4 = this;

      var mapper = function mapper(item, index) {
        return _this4.simulate_work(index) + 1;
      };
      if (this.state.chunkified) {
        return _dist2['default'].map(RANGE, mapper, $scope.experiment.options());
      } else {
        return Promise.resolve(RANGE.map(mapper));
      }
    },

    _each: function _each() {
      var _this5 = this;

      var each_fn = function each_fn(index) {
        _this5.simulate_work(index);
      };
      if (this.state.chunkified) {
        return _dist2['default'].each(RANGE, each_fn, $scope.experiment.options());
      } else {
        return Promise.resolve(RANGE.forEach(each_fn));
      }
    },

    _range: function _range() {
      var _this6 = this;

      var loop_fn = function loop_fn(index) {
        _this6.simulate_work(index);
      };
      if (this.state.chunkified) {
        return _dist2['default'].range(loop_fn, RANGE.length, $scope.experiment.options());
      } else {
        return Promise.resolve(this._blocking_range(loop_fn));
      }
    },

    _blocking_range: function _blocking_range(loop_fn) {
      for (var index = 0; index < RANGE.length; index++) {
        loop_fn(index);
      }
    }

  };

  // some metaprogramming to avoid boilerplate
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    var _loop = function () {
      var action = _step.value;

      $scope.actions[action] = _lodash2['default'].compose(function (promise) {
        $scope.actions._after_action(promise);
      }, function (options) {
        return $scope.actions['_' + action](options);
      }, function (options) {
        return $scope.actions._before_action(action, options);
      });
    };

    for (var _iterator = $scope.actions.names[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      _loop();
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator['return']) {
        _iterator['return']();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
}]).directive('wisp', ['$interval', function ($interval) {
  var marked1$0 = [shifts_generator].map(regeneratorRuntime.mark);

  function shifts_generator($element, $parent) {
    var shifts_index, random_horizontal_offset, random_vertical_offset, shifts, length;
    return regeneratorRuntime.wrap(function shifts_generator$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          shifts_index = 0;

          random_horizontal_offset = function random_horizontal_offset() {
            var width = $parent.width();
            return random_integer({ min: 0.25 * width, max: width });
          };

          random_vertical_offset = function random_vertical_offset() {
            var height = $parent.height();
            return random_integer({ min: 0.25 * height, max: height });
          };

          shifts = [function () {
            var max_horizontal_offset = $parent.offset().left + $parent.width() - ($element.offset().left + $element.width());
            return {
              left: '+=' + Math.min(random_horizontal_offset(), max_horizontal_offset)
            };
          }, function () {
            var max_vertical_offset = $parent.offset().top + $parent.height() - ($element.offset().top + $element.height());
            return {
              top: '+=' + Math.min(random_vertical_offset(), max_vertical_offset)
            };
          }, function () {
            var max_horizontal_offset = $element.offset().left - $parent.offset().left;
            return {
              left: '-=' + Math.min(random_horizontal_offset(), max_horizontal_offset) };
          }, function () {
            var max_vertical_offset = $element.offset().top - $parent.offset().top;
            return {
              top: '-=' + Math.min(random_vertical_offset(), max_vertical_offset)
            };
          }];
          length = shifts.length;

        case 5:
          if (!true) {
            context$2$0.next = 10;
            break;
          }

          context$2$0.next = 8;
          return shifts[random_integer({ min: 0, max: length })]();

        case 8:
          context$2$0.next = 5;
          break;

        case 10:
        case 'end':
          return context$2$0.stop();
      }
    }, marked1$0[0], this);
  }
  return {
    replace: true,
    link: function link(__, element) {
      var $element = (0, _jquery2['default'])(element);
      var $parent = $element.parent();
      var shifts = shifts_generator($element, $parent);
      var animate = function animate() {
        var transparent = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

        var css = shifts.next().value;
        if (transparent) {
          _lodash2['default'].extend(css, { opacity: 0.5 });
        } else {
          _lodash2['default'].extend(css, { opacity: 1 });
        }
        $element.animate(css, 400, animate.bind(null, !transparent));
      };
      animate();
    },
    template: '<div id="wisp"></div>'
  };
}]).directive('wispContainer', ['$window', function ($window) {
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    scope: {},
    link: function link(__, element, attrs) {
      var min_width = parseInt(attrs.minWidth);
      var min_height = parseInt(attrs.minHeight);
      var $element = (0, _jquery2['default'])(element);
      var resize = function resize() {
        var width = Math.max((0, _jquery2['default'])(window).width() - 250, min_width);
        var height = Math.max((0, _jquery2['default'])(window).height() - 225, min_height);
        $element.css({ width: width, height: height });
        return true;
      };
      resize() && ($window.onresize = resize);
    },
    template: '<div class=\'wisp-container\' ng-transclude></div>'
  };
}]).directive('actionCode', function () {
  return {
    restrict: 'E',
    scope: {
      state: '=',
      chunk: '=',
      delay: '='
    },
    link: function link(__, element) {
      (0, _jquery2['default'])(element).find('.action-code').css({
        width: '100%',
        height: '100%'
      });
    },
    template: '<div class="action-code">\n          <pre>\n// <strong>chunkified</strong> actions keep the animation active.\n// un-checking <strong>chunkified</strong> will cause actions to momentarily lock your browser.\n\nconst RANGE = _.range(0.5 * Math.pow(10, 5));\n<strong>let chunk = {{chunk}};</strong>\n<strong>let delay = {{delay}};</strong>\nlet simulate_work = (index) => {\n  let i = 0;\n  while (i < random_integer()) {\n    i++\n  }\n  return index\n};\n          </pre>\n          <pre>\n            {{state | code}}\n          </pre>\n        </div>'
  };
}).filter('code', function () {
  var code_by_action = {
    map: function map() {
      var chunkified = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      var setup = '\nlet mapper = (item, index) => {\n  return simulate_work(index) + 1\n};';
      if (chunkified) {
        return '\n' + setup + '\nreturn chunkify.map(RANGE, mapper, {chunk, delay})';
      } else {
        return '\n' + setup + '\nreturn RANGE.map(mapper))';
      }
    },
    reduce: function reduce() {
      var chunkified = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      var setup = '\nlet reducer = (memo, item, index) => {\n  return memo + simulate_work(index);\n};\nlet memo = 0;';
      if (chunkified) {
        return '\n' + setup + '\nreturn chunkify.reduce(RANGE, reducer, {memo, chunk, delay})';
      } else {
        return '\n' + setup + '\nreturn RANGE.reduce(reducer, memo)';
      }
    },
    each: function each() {
      var chunkified = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      var setup = '\nlet each_fn = (index) => {\n  simulate_work(index)\n};';
      if (chunkified) {
        return '\n' + setup + '\nreturn chunkify.each(RANGE, each_fn, {chunk, delay})';
      } else {
        return '\n' + setup + '\nreturn RANGE.forEach(each_fn)';
      }
    },
    range: function range() {
      var chunkified = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      var setup = '\nlet loop_fn = (index) => {\n  simulate_work(index)\n};';
      if (chunkified) {
        return '\n' + setup + '\nreturn chunkify.range(loop_fn, RANGE.length, {chunk, delay})';
      } else {
        return '\n' + setup + '\nfor (let index = 0; index < RANGE.length; index++) {\n  loop_fn(index)\n}';
      }
    }
  };
  return function (state) {
    if (state.selected === null) {
      return '\nHover over an action button on the left sidebar.';
    } else {
      var selected = state.selected;
      var chunkified = state.chunkified;

      return '\n// action: ' + selected + '\n// chunkified: ' + chunkified + '\n' + code_by_action[selected](chunkified) + '\n';
    }
  };
}).directive('experiment', function () {
  return {
    scope: {
      state: '=',
      disable: '&',
      enable: '&'
    },
    link: function link(scope) {
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
        initial_chunk: scope.state.chunk,
        initial_delay: scope.state.delay,
        disabled: false,
        reset: function reset() {
          if (!scope.state.progress) {
            scope.state.chunk = this.initial_chunk;
            scope.state.delay = this.initial_delay;
          }
        }
      };
      scope.$watch('state', function (state, prev) {
        if (prev.chunk !== state.chunk || prev.delay !== state.delay) {
          if (scope.form.$valid) {
            scope.enable();
          } else {
            scope.disable();
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
    template: '<div class="blurb">\n        <dl>\n          <section>\n            <dt>{{iterations.label}}</dt>\n            <dd>{{iterations.value}}</dd>\n          </section>\n        </dl>\n        <form name="form">\n          <section>\n            <label for="chunk">chunk size</label>\n            <input class="form-control" type="number" required ng-disabled="inputs.disabled"\n                   name="chunk" min="{{chunk.min}}" max="{{chunk.max}}" ng-model="state.chunk" />\n          </section>\n          <section>\n            <label for="delay">delay time</label>\n            <input class="form-control" type="number" required ng-disabled="inputs.disabled"\n                   name="delay" min="{{delay.min}}" max="{{delay.max}}" ng-model="state.delay" />\n          </section>\n          <a ng-click="inputs.reset()">reset</a>\n        </form>\n      </div>'
  };
}).directive('progressbar', function () {
  return {
    restrict: 'E',
    scope: {
      progress: '=progress',
      max: '=max'
    },
    link: function link(scope, element) {
      var $element = (0, _jquery2['default'])(element);
      var $bar = $element.find('#progressbar').eq(0).progressbar({
        max: scope.max,
        value: 0
      });
      var progress = function progress(value) {
        $bar.progressbar('option', 'value', value);
      };
      scope.$watch('progress', progress);
    },
    template: '<div class="progressbar-container">\n        <div id="progressbar"></div>\n      </div>'
  };
}).filter('titlecase', function () {
  return function (word) {
    return '' + word.charAt(0).toUpperCase() + word.slice(1);
  };
});