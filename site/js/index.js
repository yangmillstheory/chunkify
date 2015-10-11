'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _dist = require('../../dist');

var _dist2 = _interopRequireDefault(_dist);

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

var _spinJs = require('spin.js');

var _spinJs2 = _interopRequireDefault(_spinJs);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

require('jquery-ui/progressbar');

require('jquery-ui/tooltip');

var random_integer = function random_integer() {
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
  var CHUNK = 100;
  var DELAY = 50;

  $scope.experiment = _underscore2['default'].defaults({}, {
    range: RANGE.length,
    chunk: CHUNK,
    delay: DELAY,
    progress: 0
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

    chunkify: true,

    progress: function progress(value) {
      if (_underscore2['default'].isNumber(value)) {
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

    _before_action: function _before_action() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

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
      if (this.chunkify) {
        return _dist2['default'].reduce(RANGE, reducer, { memo: memo, chunk: CHUNK, delay: DELAY });
      } else {
        return Promise.resolve(RANGE.reduce(reducer, memo));
      }
    },

    _map: function _map() {
      var _this4 = this;

      var mapper = function mapper(item, index) {
        return _this4.simulate_work(index) + 1;
      };
      if (this.chunkify) {
        return _dist2['default'].map(RANGE, mapper, { chunk: CHUNK, delay: DELAY });
      } else {
        return Promise.resolve(RANGE.map(mapper));
      }
    },

    _each: function _each() {
      var _this5 = this;

      var each_fn = function each_fn(index) {
        _this5.simulate_work(index);
      };
      if (this.chunkify) {
        return _dist2['default'].each(RANGE, each_fn, { chunk: CHUNK, delay: DELAY });
      } else {
        return Promise.resolve(RANGE.forEach(each_fn));
      }
    },

    _range: function _range() {
      var _this6 = this;

      var loop_fn = function loop_fn(index) {
        _this6.simulate_work(index);
      };
      if (this.chunkify) {
        return _dist2['default'].range(loop_fn, RANGE.length, { chunk: CHUNK, delay: DELAY });
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
      var method = _step.value;

      $scope.actions[method] = _underscore2['default'].compose(function (promise) {
        $scope.actions._after_action(promise);
      }, function (options) {
        return $scope.actions['_' + method](options);
      }, function (options) {
        return $scope.actions._before_action(options);
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
}]).directive('wisp', ['$interval', '$window', function ($interval, $window) {
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
      var resize = function resize() {
        var width = (0, _jquery2['default'])(window).width() - 250;
        var height = (0, _jquery2['default'])(window).height() - 225;
        $parent.css({ width: width, height: height });
        return true;
      };
      resize() && ($window.onresize = resize);
      var shifts = shifts_generator($element, $parent);
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
}]).directive('experimentBackdrop', function () {
  return {
    restrict: 'E',
    scope: {
      data: '='
    },
    link: function link(__, element) {
      (0, _jquery2['default'])(element).find('.experiment-code').css({
        width: '100%',
        height: '100%'
      });
    },
    template: '<div class="experiment-code">' + '<code></code>' + '</div>'
  };
}).directive('experiment', function () {
  return {
    scope: {
      params: '=',
      disable: '&',
      enable: '&'
    },
    link: function link(scope) {
      scope.iterations = {
        label: 'Iterations',
        value: scope.params.progress
      };
      scope.chunk = {
        min: 100,
        max: 1000,
        label: 'chunk size'
      };
      scope.delay = {
        min: 10,
        max: 1000,
        label: 'delay time'
      };
      scope.$watch('params', function (params) {
        if (scope.form.$valid) {
          scope.enable();
        } else {
          scope.disable();
        }
        scope.iterations.value = params.progress;
      }, true);
    },
    template: '<div class="blurb">' + '<dl>' + '<section>' + '<dt>{{iterations.label}}</dt>' + '<dd>{{iterations.value}}</dd>' + '</section>' + '</dl>' + '<form name="form">' + '<section>' + '<label for="chunk">chunk size</label>' + '<input class="form-control" type="number" required name="chunk" min="{{chunk.min}}" max="{{chunk.max}}" ng-model="params.chunk" />' + '</section>' + '<section>' + '<label for="delay">delay time</label>' + '<input class="form-control" type="number" required name="delay" min="{{delay.min}}" max="{{delay.max}}" ng-model="params.delay" />' + '</section>' + '</form>' + '<p>' + '<strong>chunkified</strong> actions keep the animation active.' + '</p>' + '<p>' + 'un-chunkified actions will <strong>momentarily lock your browser</strong>.' + '</p>' + '</div>'
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
    template: '<div class="progressbar-container">' + '<div id="progressbar"></div>' + '</div>'
  };
}).filter('titlecase', function () {
  return function (word) {
    return '' + word.charAt(0).toUpperCase() + word.slice(1);
  };
});