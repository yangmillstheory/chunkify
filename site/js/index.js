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

_angular2['default'].module('chunkify-demo', []).controller('ChunkifyCtrl', function ($scope) {
  var RANGE = _underscore2['default'].range(0.5 * Math.pow(10, 6));
  var simulate_work = function simulate_work() {
    var random_integer = function random_integer() {
      var max = Math.pow(10, 3);
      var min = Math.pow(10, 3) * .75;
      return Math.random() * (max - min) + min;
    };
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

    names: ['map', 'reduce', 'each', 'loop'],

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
      var reducer = function reducer(memo, item) {
        simulate_work();
        return memo + item;
      };
      var memo = 0;
      if ($scope.actions.chunkify) {
        return _dist2['default'].reduce(RANGE, reducer, { memo: memo, chunk: 1000, delay: 10 });
      } else {
        return Promise.resolve(RANGE.reduce(reducer, memo));
      }
    },

    _map: function _map() {
      var mapper = function mapper(item) {
        simulate_work();
        return item + 1;
      };
      if ($scope.actions.chunkify) {
        return _dist2['default'].map(RANGE, mapper, { chunk: 1000, delay: 10 });
      } else {
        return Promise.resolve(RANGE.map(mapper));
      }
    },

    _each: function _each() {
      return new Promise(function (resolve) {
        return setTimeout(resolve, 3000);
      });
    },

    _loop: function _loop() {
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
    var _loop2 = function () {
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
      _loop2();
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
})
// Fills parent with a fixed number of cells.
//
//  On resize, resizes those cells too.
.directive('animationGrid', function ($interval, $window) {
  return {
    replace: true,
    link: function link(scope, element) {
      var $parent = (0, _jquery2['default'])(element).parent();
      var resize = function resize() {
        $parent.css({
          width: $window.innerWidth - 200,
          height: $window.innerHeight - 250
        });
      };
      resize();
      $window.onresize = resize;
    },
    template: '<div class="animation"></div>'
  };
}).filter('titlecase', function () {
  return function (word) {
    return '' + word.charAt(0).toUpperCase() + word.slice(1);
  };
});