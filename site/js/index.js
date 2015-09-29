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
  var blocking = function blocking() {
    var i = 0;
    while (i < Math.pow(10, 3)) {
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

    _clean_options: function _clean_options(options) {
      _underscore2['default'].defaults(options, { chunkify: false });
    },

    _before_action: function _before_action() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      this._clean_options(options);
      $scope.buttons.disable();
      return options;
    },

    _after_action: function _after_action(promise) {
      promise.then(function (value) {
        $scope.buttons.enable();
        $scope.$digest();
      });
    },

    _reduce: function _reduce(options) {
      var reducer = function reducer(memo, item) {
        blocking();
        return memo + item;
      };
      var memo = 0;
      if (options.chunkify) {
        return _dist2['default'].reduce(RANGE, reducer, { memo: memo, chunk: 2500, delay: 10 });
      } else {
        //return Promise.resolve(RANGE.reduce(reducer, memo))
        return Promise.resolve(RANGE.reduce(reducer, memo));
      }
    },

    _map: function _map(options) {
      var mapper = function mapper(item) {
        blocking();
        return item + 1;
      };
      if (options.chunkify) {
        return _dist2['default'].map(RANGE, mapper, { chunk: 2500, delay: 10 });
      } else {
        return Promise.resolve(RANGE.map(mapper));
      }
    },

    _each: function _each(options) {
      console.log('chunk each');
      return new Promise(function (resolve) {
        return setTimeout(resolve, 3000);
      });
    },

    _loop: function _loop(options) {
      console.log('chunk loop');
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
}).directive('animation', function ($interval, $window) {
  return {
    replace: true,
    link: function link(scope, element) {
      var duration = 1000;
      var cssprops = {
        'background-color': '#34495e',
        'border-radius': '6px',
        'margin': '50px auto',
        'width': (0, _jquery2['default'])($window).width() - 300,
        'height': (0, _jquery2['default'])($window).height() - 300
      };
      var $element = (0, _jquery2['default'])(element);
      $element.css(cssprops);
      var animate = function animate(shrink) {
        var complete = function complete() {
          animate(!shrink);
        };
        var css;
        if (shrink) {
          css = { width: cssprops.width / 2, height: cssprops.height / 2 };
        } else {
          css = { width: cssprops.width, height: cssprops.height };
        }
        $element.animate(css, duration, complete);
      };
      animate(true);
    },

    template: '<div class="animation"></div>'
  };
});