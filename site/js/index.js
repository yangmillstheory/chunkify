'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _dist = require('../../dist');

var _dist2 = _interopRequireDefault(_dist);

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

require('jquery-ui/progressbar');

require('jquery-ui/tooltip');

var randomInteger = function randomInteger() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _$defaults = _underscore2['default'].defaults(options, {
    max: Math.pow(10, 2),
    min: Math.pow(10, 2) * .75
  });

  var max = _$defaults.max;
  var min = _$defaults.min;

  return Math.floor(Math.random() * (max - min) + min);
};

_angular2['default'].module('chunkify-demo', []).controller('ChunkifyCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
  var RANGE = _underscore2['default'].range(0.5 * Math.pow(10, 5));
  var DEFAULT_CHUNK = 100;
  var DEFAULT_DELAY = 50;

  $scope.experiment = _underscore2['default'].defaults({}, {
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
      if (_underscore2['default'].isNumber(value)) {
        $scope.experiment.progress = value;
      } else {
        $scope.experiment.progress += 1;
      }
    },

    simulateWork: function simulateWork(index) {
      var _this = this;

      $timeout(function () {
        _this.progress();
      });
      var i = 0;
      while (i < randomInteger()) {
        i++;
      }
      return index;
    },

    _cleanOptions: function _cleanOptions(options) {
      // currently a no-op
      return options;
    },

    _beforeAction: function _beforeAction(action) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      this.select(action);
      $scope.buttons.disable();
      return this._cleanOptions(options);
    },

    _afterAction: function _afterAction(promise) {
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
        return memo + _this3.simulateWork(index);
      };
      var memo = 0;
      if (this.state.chunkified) {
        return _dist2['default'].reduce(RANGE, reducer, _underscore2['default'].extend({ memo: memo }, $scope.experiment.options()));
      } else {
        return Promise.resolve(RANGE.reduce(reducer, memo));
      }
    },

    _map: function _map() {
      var _this4 = this;

      var mapper = function mapper(item, index) {
        return _this4.simulateWork(index) + 1;
      };
      if (this.state.chunkified) {
        return _dist2['default'].map(RANGE, mapper, $scope.experiment.options());
      } else {
        return Promise.resolve(RANGE.map(mapper));
      }
    },

    _each: function _each() {
      var _this5 = this;

      var eachFn = function eachFn(index) {
        _this5.simulateWork(index);
      };
      if (this.state.chunkified) {
        return _dist2['default'].each(RANGE, eachFn, $scope.experiment.options());
      } else {
        return Promise.resolve(RANGE.forEach(eachFn));
      }
    },

    _range: function _range() {
      var _this6 = this;

      var loopFn = function loopFn(index) {
        _this6.simulateWork(index);
      };
      if (this.state.chunkified) {
        return _dist2['default'].range(loopFn, RANGE.length, $scope.experiment.options());
      } else {
        return Promise.resolve(this._blockingRange(loopFn));
      }
    },

    _blockingRange: function _blockingRange(loopFn) {
      for (var index = 0; index < RANGE.length; index++) {
        loopFn(index);
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

      $scope.actions[action] = _underscore2['default'].compose(function (promise) {
        $scope.actions._afterAction(promise);
      }, function (options) {
        return $scope.actions['_' + action](options);
      }, function (options) {
        return $scope.actions._beforeAction(action, options);
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
  var marked1$0 = [shiftsGenerator].map(regeneratorRuntime.mark);

  function shiftsGenerator($element, $parent) {
    var shifts_index, randomHorizontalOffset, randomVerticalOffset, shifts, length;
    return regeneratorRuntime.wrap(function shiftsGenerator$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          shifts_index = 0;

          randomHorizontalOffset = function randomHorizontalOffset() {
            var width = $parent.width();
            return randomInteger({ min: 0.25 * width, max: width });
          };

          randomVerticalOffset = function randomVerticalOffset() {
            var height = $parent.height();
            return randomInteger({ min: 0.25 * height, max: height });
          };

          shifts = [function () {
            var maxHorizontalOffset = $parent.offset().left + $parent.width() - ($element.offset().left + $element.width());
            return {
              left: '+=' + Math.min(randomHorizontalOffset(), maxHorizontalOffset)
            };
          }, function () {
            var maxVerticalOffset = $parent.offset().top + $parent.height() - ($element.offset().top + $element.height());
            return {
              top: '+=' + Math.min(randomVerticalOffset(), maxVerticalOffset)
            };
          }, function () {
            var maxHorizontalOffset = $element.offset().left - $parent.offset().left;
            return {
              left: '-=' + Math.min(randomHorizontalOffset(), maxHorizontalOffset) };
          }, function () {
            var maxVerticalOffset = $element.offset().top - $parent.offset().top;
            return {
              top: '-=' + Math.min(randomVerticalOffset(), maxVerticalOffset)
            };
          }];
          length = shifts.length;

        case 5:
          if (!true) {
            context$2$0.next = 10;
            break;
          }

          context$2$0.next = 8;
          return shifts[randomInteger({ min: 0, max: length })]();

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
    link: function link(scope, element) {
      var $element = (0, _jquery2['default'])(element);
      var $parent = $element.parent();
      var shifts = shiftsGenerator($element, $parent);
      var animate = function animate() {
        var transparent = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

        var css = shifts.next().value;
        if (transparent) {
          _underscore2['default'].extend(css, { opacity: 0.5 });
        } else {
          _underscore2['default'].extend(css, { opacity: 1 });
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
    link: function link(scope, element, attrs) {
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
    link: function link(scope, element) {
      (0, _jquery2['default'])(element).find('.action-code').css({
        width: '100%',
        height: '100%'
      });
    },
    template: '<div class="action-code">\n          <pre>\n// <strong>chunkified</strong> actions keep the animation active.\n// un-checking <strong>chunkified</strong> will cause actions to momentarily lock your browser.\n\nconst RANGE = _.range(0.5 * Math.pow(10, 5));\n<strong>let chunk = {{chunk}};</strong>\n<strong>let delay = {{delay}};</strong>\nlet simulateWork = (index) => {\n  let i = 0;\n  while (i < randomInteger()) {\n    i++\n  }\n  return index\n};\n          </pre>\n          <pre>\n            {{state | code}}\n          </pre>\n        </div>'
  };
}).filter('code', function () {
  var code_by_action = {
    map: function map() {
      var chunkified = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      var setup = '\nlet mapper = (item, index) => {\n  return simulateWork(index) + 1\n};';
      if (chunkified) {
        return '\n' + setup + '\nreturn chunkify.map(RANGE, mapper, {chunk, delay})';
      } else {
        return '\n' + setup + '\nreturn RANGE.map(mapper))';
      }
    },
    reduce: function reduce() {
      var chunkified = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      var setup = '\nlet reducer = (memo, item, index) => {\n  return memo + simulateWork(index);\n};\nlet memo = 0;';
      if (chunkified) {
        return '\n' + setup + '\nreturn chunkify.reduce(RANGE, reducer, {memo, chunk, delay})';
      } else {
        return '\n' + setup + '\nreturn RANGE.reduce(reducer, memo)';
      }
    },
    each: function each() {
      var chunkified = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      var setup = '\nlet eachFn = (index) => {\n  simulateWork(index)\n};';
      if (chunkified) {
        return '\n' + setup + '\nreturn chunkify.each(RANGE, eachFn, {chunk, delay})';
      } else {
        return '\n' + setup + '\nreturn RANGE.forEach(eachFn)';
      }
    },
    range: function range() {
      var chunkified = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      var setup = '\nlet loopFn = (index) => {\n  simulateWork(index)\n};';
      if (chunkified) {
        return '\n' + setup + '\nreturn chunkify.range(loopFn, RANGE.length, {chunk, delay})';
      } else {
        return '\n' + setup + '\nfor (let index = 0; index < RANGE.length; index++) {\n  loopFn(index)\n}';
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
        initialChunk: scope.state.chunk,
        initialDelay: scope.state.delay,
        disabled: false,
        reset: function reset() {
          if (!scope.state.progress) {
            scope.state.chunk = this.initialChunk;
            scope.state.delay = this.initialDelay;
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