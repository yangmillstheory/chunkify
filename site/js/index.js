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

  return Math.random() * (max - min) + min;
};

_angular2['default'].module('chunkify-demo', []).controller('ChunkifyCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
  var RANGE = _underscore2['default'].range(0.5 * Math.pow(10, 5));
  var CHUNK = 100;
  var DELAY = 10;

  $scope.experiment = {
    length: RANGE.length,
    chunk: CHUNK,
    delay: DELAY
  };

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

    progress_data: { value: 0, max: $scope.experiment.length },

    progress: function progress() {
      this.progress_data.value += 1;
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
      promise.then(function (value) {
        $timeout(function () {
          $scope.actions.progress_data.value = 0;
          $scope.buttons.enable();
        }, 1000);
      });
    },

    _reduce: function _reduce() {
      var _this2 = this;

      var reducer = function reducer(memo, item, index) {
        return memo + _this2.simulate_work(index);
      };
      var memo = 0;
      if (this.chunkify) {
        return _dist2['default'].reduce(RANGE, reducer, { memo: memo, chunk: CHUNK, delay: DELAY });
      } else {
        return Promise.resolve(RANGE.reduce(reducer, memo));
      }
    },

    _map: function _map() {
      var _this3 = this;

      var mapper = function mapper(item, index) {
        return _this3.simulate_work(index) + 1;
      };
      if (this.chunkify) {
        return _dist2['default'].map(RANGE, mapper, { chunk: CHUNK, delay: DELAY });
      } else {
        return Promise.resolve(RANGE.map(mapper));
      }
    },

    _each: function _each() {
      var _this4 = this;

      var each_fn = function each_fn(index) {
        _this4.simulate_work(index);
      };
      if (this.chunkify) {
        return _dist2['default'].each(RANGE, each_fn, { chunk: CHUNK, delay: DELAY });
      } else {
        return Promise.resolve(RANGE.forEach(each_fn));
      }
    },

    _range: function _range() {
      var _this5 = this;

      var loop_fn = function loop_fn(index) {
        _this5.simulate_work(index);
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
}]).directive('animation', ['$interval', '$window', function ($interval, $window) {
  var marked1$0 = [shifts_generator].map(regeneratorRuntime.mark);

  var intial_css = {
    'background-color': '#4d63bc',
    'border-radius': '100px',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100px',
    height: '100px'
  };
  function shifts_generator($element, $parent) {
    var shifts_index, random_left, random_top, shifts, length;
    return regeneratorRuntime.wrap(function shifts_generator$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          shifts_index = 0;

          random_left = function random_left() {
            return random_integer({ min: 0, max: $parent.width() });
          };

          random_top = function random_top() {
            return random_integer({ min: 0, max: $parent.height() });
          };

          shifts = [function () {
            return {
              left: '+=' + Math.min(random_left(), $parent.offset().left + $parent.width() - ($element.offset().left + $element.width()))
            };
          }, function () {
            return {
              top: '+=' + Math.min(random_top(), $parent.offset().top + $parent.height() - ($element.offset().top + $element.height()))
            };
          }, function () {
            return {
              left: '-=' + Math.min(random_left(), $element.offset().left - $parent.offset().left) };
          }, function () {
            return {
              top: '-=' + Math.min(random_top(), $element.offset().top - $parent.offset().top)
            };
          }];
          length = shifts.length;

        case 5:
          if (!true) {
            context$2$0.next = 11;
            break;
          }

          context$2$0.next = 8;
          return shifts[shifts_index++]();

        case 8:
          if (shifts_index % length === 0) {
            shifts_index = 0;
          }
          context$2$0.next = 5;
          break;

        case 11:
        case 'end':
          return context$2$0.stop();
      }
    }, marked1$0[0], this);
  }
  return {
    replace: true,
    link: function link(__, element) {
      var $element = (0, _jquery2['default'])(element).css(intial_css);
      var $parent = $element.parent();
      var resize = function resize() {
        var width = $window.innerWidth - 300;
        var height = $window.innerHeight - 250;
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
        $element.animate(css, 'slow', animate.bind(null, !transparent));
      };
      animate();
    },
    template: '<div id="animation"></div>'
  };
}]).directive('chunkifyInfo', function () {
  return {
    scope: {
      experiment: '='
    },
    link: function link(scope, element) {
      scope.table = {
        data: [{ label: 'Iterations', value: scope.experiment.length }, { label: 'Chunk Size', value: scope.experiment.chunk }, { label: 'Delay Time', value: scope.experiment.delay + ' ms' }]
      };
    },
    template: '<div class="blurb">' + '<dl>' + '<section ng-repeat="data in table.data">' + '<dt>{{data.label}}</dt>' + '<dd>{{data.value}}</dd>' + '</section>' + '</dl>' + '<p>' + 'Keeping <strong>chunkified</strong> on keeps the animation active.' + '</p>' + '<p>' + 'Turning it off will <strong>lock your browser momentarily</strong> when you initiate an action.' + '</p>' + '</div>'
  };
}).directive('progressbar', ['$timeout', function ($timeout) {
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
        value: 0,
        complete: function complete() {
          if (scope.progress > 0) {
            scope.progress = 0;
          }
        }
      });
      var progress = function progress(value) {
        $bar.progressbar('option', 'value', value);
      };
      scope.$watch('progress', progress);
      $element.tooltip({
        position: {
          my: 'left+115 top-25'
        }
      });
    },
    template: '<div class="progressbar-container" title="{{progress}} of {{max}} iterations processed">' + '<div id="progressbar"></div>' + '</div>'
  };
}]).filter('titlecase', function () {
  return function (word) {
    return '' + word.charAt(0).toUpperCase() + word.slice(1);
  };
});