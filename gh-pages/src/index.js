require('babel-polyfill');
var dist_1 = require('../../dist');
var angular_1 = require('angular');
var lodash_1 = require('lodash');
var jquery_1 = require('jquery');
require('jquery-ui/progressbar');
require('jquery-ui/tooltip');
var randomInteger = function (options) {
    if (options === void 0) { options = {}; }
    var _a = lodash_1["default"].defaults(options, {
        max: Math.pow(10, 2),
        min: Math.pow(10, 2) * .75
    }), max = _a.max, min = _a.min;
    return Math.floor(Math.random() * (max - min) + min);
};
angular_1["default"]
    .module('chunkify-demo', [])
    .controller('ChunkifyCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
        var RANGE = lodash_1["default"].range(0.5 * Math.pow(10, 5));
        var DEFAULT_CHUNK = 100;
        var DEFAULT_DELAY = 50;
        $scope.experiment = lodash_1["default"].defaults({}, {
            progress: 0,
            range: RANGE.length,
            chunk: DEFAULT_CHUNK,
            delay: DEFAULT_DELAY,
            options: function () {
                return { delay: this.delay, chunk: this.chunk };
            }
        });
        $scope.buttons = {
            disabled: false,
            disable: function () {
                this.disabled = true;
            },
            enable: function () {
                this.disabled = false;
            }
        };
        $scope.actions = {
            names: ['map', 'reduce', 'each', 'range'],
            state: {
                chunkified: true,
                selected: null
            },
            selected: function (action) {
                return this.state.selected === action;
            },
            select: function (action) {
                this.state.selected = action;
            },
            progress: function (value) {
                if (lodash_1["default"].isNumber(value)) {
                    $scope.experiment.progress = value;
                }
                else {
                    $scope.experiment.progress += 1;
                }
            },
            simulateWork: function (index) {
                var _this = this;
                $timeout(function () { _this.progress(); });
                var i = 0;
                while (i < randomInteger()) {
                    i++;
                }
                return index;
            },
            _cleanOptions: function (options) {
                // currently a no-op
                return options;
            },
            _beforeAction: function (action, options) {
                if (options === void 0) { options = {}; }
                this.select(action);
                $scope.buttons.disable();
                return this._cleanOptions(options);
            },
            _afterAction: function (promise) {
                var _this = this;
                promise.then(function (value) {
                    $timeout(function () {
                        _this.progress(0);
                        $scope.buttons.enable();
                    }, 1000);
                });
            },
            _reduce: function () {
                var _this = this;
                var reducer = function (memo, item, index) {
                    return memo + _this.simulateWork(index);
                };
                var memo = 0;
                if (this.state.chunkified) {
                    return dist_1["default"].reduce(RANGE, reducer, lodash_1["default"].extend({ memo: memo }, $scope.experiment.options()));
                }
                else {
                    return Promise.resolve(RANGE.reduce(reducer, memo));
                }
            },
            _map: function () {
                var _this = this;
                var mapper = function (item, index) {
                    return _this.simulateWork(index) + 1;
                };
                if (this.state.chunkified) {
                    return dist_1["default"].map(RANGE, mapper, $scope.experiment.options());
                }
                else {
                    return Promise.resolve(RANGE.map(mapper));
                }
            },
            _each: function () {
                var _this = this;
                var eachFn = function (index) {
                    _this.simulateWork(index);
                };
                if (this.state.chunkified) {
                    return dist_1["default"].each(RANGE, eachFn, $scope.experiment.options());
                }
                else {
                    return Promise.resolve(RANGE.forEach(eachFn));
                }
            },
            _range: function () {
                var _this = this;
                var loopFn = function (index) {
                    _this.simulateWork(index);
                };
                if (this.state.chunkified) {
                    return dist_1["default"].range(loopFn, RANGE.length, $scope.experiment.options());
                }
                else {
                    return Promise.resolve(this._blockingRange(loopFn));
                }
            },
            _blockingRange: function (loopFn) {
                for (var index = 0; index < RANGE.length; index++) {
                    loopFn(index);
                }
            }
        };
        // some metaprogramming to avoid boilerplate
        for (var _i = 0, _a = $scope.actions.names; _i < _a.length; _i++) {
            var action = _a[_i];
            $scope.actions[action] = lodash_1["default"].compose(function (promise) {
                $scope.actions._afterAction(promise);
            }, function (options) {
                return $scope.actions[("_" + action)](options);
            }, function (options) {
                return $scope.actions._beforeAction(action, options);
            });
        }
    }])
    .directive('wisp', ['$interval', function ($interval) {
        function shiftsGenerator($element, $parent) {
            var shifts_index = 0;
            var randomHorizontalOffset = function () {
                var width = $parent.width();
                return randomInteger({ min: 0.25 * width, max: width });
            };
            var randomVerticalOffset = function () {
                var height = $parent.height();
                return randomInteger({ min: 0.25 * height, max: height });
            };
            var shifts = [
                function () {
                    var maxHorizontalOffset = ($parent.offset().left + $parent.width()) -
                        ($element.offset().left + $element.width());
                    return {
                        left: "+=" + Math.min(randomHorizontalOffset(), maxHorizontalOffset)
                    };
                },
                function () {
                    var maxVerticalOffset = ($parent.offset().top + $parent.height()) -
                        ($element.offset().top + $element.height());
                    return {
                        top: "+=" + Math.min(randomVerticalOffset(), maxVerticalOffset)
                    };
                },
                function () {
                    var maxHorizontalOffset = $element.offset().left - $parent.offset().left;
                    return {
                        left: "-=" + Math.min(randomHorizontalOffset(), maxHorizontalOffset) };
                },
                function () {
                    var maxVerticalOffset = $element.offset().top - $parent.offset().top;
                    return {
                        top: "-=" + Math.min(randomVerticalOffset(), maxVerticalOffset)
                    };
                }
            ];
            var length = shifts.length;
            while (true) {
                yield shifts[randomInteger({ min: 0, max: length })]();
            }
        }
        return {
            replace: true,
            link: function (scope, element) {
                var $element = jquery_1["default"](element);
                var $parent = $element.parent();
                var shifts = shiftsGenerator($element, $parent);
                var animate = function (transparent) {
                    if (transparent === void 0) { transparent = false; }
                    var css = shifts.next().value;
                    if (transparent) {
                        lodash_1["default"].extend(css, { opacity: 0.5 });
                    }
                    else {
                        lodash_1["default"].extend(css, { opacity: 1 });
                    }
                    $element.animate(css, 400, animate.bind(null, !transparent));
                };
                animate();
            },
            template: '<div id="wisp"></div>'
        };
    }])
    .directive('wispContainer', ['$window', function ($window) {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            scope: {},
            link: function (scope, element, attrs) {
                var min_width = parseInt(attrs.minWidth);
                var min_height = parseInt(attrs.minHeight);
                var $element = jquery_1["default"](element);
                var resize = function () {
                    var width = Math.max(jquery_1["default"](window).width() - 250, min_width);
                    var height = Math.max(jquery_1["default"](window).height() - 225, min_height);
                    $element.css({ width: width, height: height });
                    return true;
                };
                resize() && ($window.onresize = resize);
            },
            template: "<div class='wisp-container' ng-transclude></div>"
        };
    }])
    .directive('actionCode', function () {
    return {
        restrict: 'E',
        scope: {
            state: '=',
            chunk: '=',
            delay: '='
        },
        link: function (scope, element) {
            jquery_1["default"](element).find('.action-code').css({
                width: '100%',
                height: '100%'
            });
        },
        template: "<div class=\"action-code\">\n          <pre>\n// <strong>chunkified</strong> actions keep the animation active.\n// un-checking <strong>chunkified</strong> will cause actions to momentarily lock your browser.\n\nconst RANGE = _.range(0.5 * Math.pow(10, 5));\n<strong>let chunk = {{chunk}};</strong>\n<strong>let delay = {{delay}};</strong>\nlet simulateWork = (index) => {\n  let i = 0;\n  while (i < randomInteger()) {\n    i++\n  }\n  return index\n};\n          </pre>\n          <pre>\n            {{state | code}}\n          </pre>\n        </div>"
    };
})
    .filter('code', function () {
    var code_by_action = {
        map: function (chunkified) {
            if (chunkified === void 0) { chunkified = false; }
            var setup = "\nlet mapper = (item, index) => {\n  return simulateWork(index) + 1\n};";
            if (chunkified) {
                return "\n" + setup + "\nreturn chunkify.map(RANGE, mapper, {chunk, delay})";
            }
            else {
                return "\n" + setup + "\nreturn RANGE.map(mapper))";
            }
        },
        reduce: function (chunkified) {
            if (chunkified === void 0) { chunkified = false; }
            var setup = "\nlet reducer = (memo, item, index) => {\n  return memo + simulateWork(index);\n};\nlet memo = 0;";
            if (chunkified) {
                return "\n" + setup + "\nreturn chunkify.reduce(RANGE, reducer, {memo, chunk, delay})";
            }
            else {
                return "\n" + setup + "\nreturn RANGE.reduce(reducer, memo)";
            }
        },
        each: function (chunkified) {
            if (chunkified === void 0) { chunkified = false; }
            var setup = "\nlet eachFn = (index) => {\n  simulateWork(index)\n};";
            if (chunkified) {
                return "\n" + setup + "\nreturn chunkify.each(RANGE, eachFn, {chunk, delay})";
            }
            else {
                return "\n" + setup + "\nreturn RANGE.forEach(eachFn)";
            }
        },
        range: function (chunkified) {
            if (chunkified === void 0) { chunkified = false; }
            var setup = "\nlet loopFn = (index) => {\n  simulateWork(index)\n};";
            if (chunkified) {
                return "\n" + setup + "\nreturn chunkify.range(loopFn, RANGE.length, {chunk, delay})";
            }
            else {
                return "\n" + setup + "\nfor (let index = 0; index < RANGE.length; index++) {\n  loopFn(index)\n}";
            }
        }
    };
    return function (state) {
        if (state.selected === null) {
            return "\nHover over an action button on the left sidebar.";
        }
        else {
            var selected = state.selected, chunkified = state.chunkified;
            return "\n// action: " + selected + "\n// chunkified: " + chunkified + "\n" + code_by_action[selected](chunkified) + "\n";
        }
    };
})
    .directive('experiment', function () {
    return {
        scope: {
            state: '=',
            disable: '&',
            enable: '&'
        },
        link: function (scope) {
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
                reset: function () {
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
                    }
                    else {
                        scope.disable();
                    }
                }
                if (state.progress) {
                    scope.iterations.value = state.progress;
                    scope.inputs.disabled = true;
                }
                else {
                    scope.iterations.value = 0;
                    scope.inputs.disabled = false;
                }
            }, true);
        },
        template: "<div class=\"blurb\">\n        <dl>\n          <section>\n            <dt>{{iterations.label}}</dt>\n            <dd>{{iterations.value}}</dd>\n          </section>\n        </dl>\n        <form name=\"form\">\n          <section>\n            <label for=\"chunk\">chunk size</label>\n            <input class=\"form-control\" type=\"number\" required ng-disabled=\"inputs.disabled\"\n                   name=\"chunk\" min=\"{{chunk.min}}\" max=\"{{chunk.max}}\" ng-model=\"state.chunk\" />\n          </section>\n          <section>\n            <label for=\"delay\">delay time</label>\n            <input class=\"form-control\" type=\"number\" required ng-disabled=\"inputs.disabled\"\n                   name=\"delay\" min=\"{{delay.min}}\" max=\"{{delay.max}}\" ng-model=\"state.delay\" />\n          </section>\n          <a ng-click=\"inputs.reset()\">reset</a>\n        </form>\n      </div>"
    };
})
    .directive('progressbar', function () {
    return {
        restrict: 'E',
        scope: {
            progress: '=progress',
            max: '=max'
        },
        link: function (scope, element) {
            var $element = jquery_1["default"](element);
            var $bar = $element.find('#progressbar').eq(0).progressbar({
                max: scope.max,
                value: 0
            });
            var progress = function (value) {
                $bar.progressbar('option', 'value', value);
            };
            scope.$watch('progress', progress);
        },
        template: "<div class=\"progressbar-container\">\n        <div id=\"progressbar\"></div>\n      </div>"
    };
})
    .filter('titlecase', function () {
    return function (word) {
        return "" + word.charAt(0).toUpperCase() + word.slice(1);
    };
});
