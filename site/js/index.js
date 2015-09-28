'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _dist = require('../../dist');

var _dist2 = _interopRequireDefault(_dist);

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

_angular2['default'].module('chunkify-demo', []).controller('ChunkifyCtrl', function ($scope) {

  this.dataset = _underscore2['default'].range(10e5);

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
      console.log('Found options.chunkify: ' + options.chunkify);
    },

    _before_action: function _before_action() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      this._clean_options(options);
      $scope.buttons.disable();
    },

    _after_action: function _after_action(promise) {
      promise.then(function () {
        $scope.buttons.enable();
        $scope.$digest();
      });
    },

    _reduce: function _reduce(options) {
      console.log('chunk reduce');
      return new Promise(function (resolve) {
        return setTimeout(resolve, 3000);
      });
    },

    _map: function _map(options) {
      console.log('chunk map');
      return new Promise(function (resolve) {
        return setTimeout(resolve, 3000);
      });
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
        $scope.actions._before_action(options);
        return options;
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
});