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

_angular2['default'].module('chunkify-demo', []).controller('ChunkifyCtrl', function ($scope) {
  var RANGE = _underscore2['default'].range(0.5 * Math.pow(10, 5));
  var CHUNK = 100;
  var DELAY = 10;
  var simulate_work = function simulate_work() {
    var i = 0;
    while (i < random_integer()) {
      i++;
    }
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

    chunkify: false,

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
        $scope.buttons.enable();
        $scope.$digest();
      });
    },

    _reduce: function _reduce() {
      var reducer = function reducer(memo, item, index) {
        simulate_work();
        return memo + item;
      };
      var memo = 0;
      if ($scope.actions.chunkify) {
        return _dist2['default'].reduce(RANGE, reducer, { memo: memo, chunk: CHUNK, delay: DELAY });
      } else {
        return Promise.resolve(RANGE.reduce(reducer, memo));
      }
    },

    _map: function _map() {
      var mapper = function mapper(item, index) {
        simulate_work();
        return item + 1;
      };
      if ($scope.actions.chunkify) {
        return _dist2['default'].map(RANGE, mapper, { chunk: CHUNK, delay: DELAY });
      } else {
        return Promise.resolve(RANGE.map(mapper));
      }
    },

    _each: function _each() {
      return new Promise(function (resolve) {
        return setTimeout(resolve, 3000);
      });
    },

    _range: function _range() {
      return new Promise(function (resolve) {
        return setTimeout(resolve, 5000);
      });
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
}).directive('animation', function ($interval, $window) {
  var marked1$0 = [shifts_generator].map(regeneratorRuntime.mark);

  var intial_css = {
    'background-color': '#4d63bc',
    'border-radius': '25px',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '25px',
    height: '25px',
    opacity: .8
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
              left: '+=' + Math.min(random_left(), $parent.offset().left + $parent.width() - $element.offset().left)
            };
          }, function () {
            return {
              top: '+=' + Math.min(random_top(), $parent.offset().top + $parent.height() - $element.offset().top)
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
    link: function link(scope, element) {
      var $element = (0, _jquery2['default'])(element).css(intial_css);
      var $parent = $element.parent();
      var resize = function resize() {
        var width = $window.innerWidth - 200;
        var height = $window.innerHeight - 250;
        $parent.css({ width: width, height: height });
        return true;
      };
      resize() && ($window.onresize = resize);
      var shifts = shifts_generator($element, $parent);
      var animate = function animate() {
        $element.animate(shifts.next().value, 'slow', animate);
      };
      animate();
    },
    template: '<div id="animation"></div>'
  };
}).filter('titlecase', function () {
  return function (word) {
    return '' + word.charAt(0).toUpperCase() + word.slice(1);
  };
});