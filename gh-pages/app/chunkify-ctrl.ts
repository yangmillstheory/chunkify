import 'babel-polyfill';
import * as chunkify from 'chunkify';
import * as angular from 'angular';
import * as _ from 'lodash';
import $ from 'jquery';
import 'jquery-ui/progressbar';
import 'jquery-ui/tooltip';


class SidebarCtrl {

};


angular
  .module('chunkify-demo', [])
  .controller('ChunkifyCtrl', ['$scope', '$timeout', function($scope: angular.IScope, $timeout: angular.ITimeoutService): void {
    const RANGE = _.range(0.5 * Math.pow(10, 5));
    const DEFAULT_CHUNK = 100;
    const DEFAULT_DELAY = 50;

    $scope.experiment = _.defaults({}, {
      progress: 0,
      range: RANGE.length,
      chunk: DEFAULT_CHUNK,
      delay: DEFAULT_DELAY,
      options() {
        return {delay: this.delay, chunk: this.chunk};
      },
    });

    $scope.buttons = {
      disabled: false,

      disable: function(): void {
        this.disabled = true;
      },

      enable: function(): void {
        this.disabled = false;
      },
    };

    $scope.actions = {

      names: ['map', 'reduce', 'each', 'range'],

      state: {
        chunkified: true,
        selected: null,
      },

      selected(action: string): boolean {
        return this.state.selected === action;
      },

      select(action: string): void {
        this.state.selected = action;
      },

      progress(value: number): void {
        if (_.isNumber(value)) {
          $scope.experiment.progress = value;
        } else {
          $scope.experiment.progress += 1;
        }
      },

      simulateWork(index: number): number {
        $timeout((): void => { this.progress(); });
        let i = 0;
        let max: number = largeRandomInteger();
        while (i < max) {
          i++;
        }
        return index;
      },

      // TODO: type options interface
      _beforeAction(action: string, options: {[key: string]: any} = {}): {[key: string]: any} {
        this.select(action);
        $scope.buttons.disable();
        return options;
      },

      _afterAction(promise: ng.IPromise<void>): void {
        promise.then(function(): void {
          $timeout(
            () => {
              this.progress(0);
              $scope.buttons.enable();
            },
            1000);
        });
      },

      _reduce(): Promise<number> {
        let reducer = (memo: number, item: number, index: number) => {
          return memo + this.simulateWork(index);
        };
        let memo = 0;
        if (this.state.chunkified) {
          return chunkify.reduce(RANGE, reducer, <IChunkifyOptions>_.extend({memo}, $scope.experiment.options()));
        } else {
          return Promise.resolve(RANGE.reduce(reducer, memo));
        }
      },

      _map(): Promise<number[]> {
        let mapper = (item: number, index: number) => {
          return this.simulateWork(index) + 1;
        };
        if (this.state.chunkified) {
          return chunkify.map(RANGE, mapper, $scope.experiment.options());
        } else {
          return Promise.resolve(RANGE.map(mapper));
        }
      },

      _each(): Promise<void> {
        let eachFn = (index: number) => {
          this.simulateWork(index);
        };
        if (this.state.chunkified) {
          return chunkify.each(RANGE, eachFn, $scope.experiment.options());
        } else {
          return Promise.resolve(RANGE.forEach(eachFn));
        }
      },

      _range(): Promise<void> {
        let loopFn = function(index: number): void {
          this.simulateWork(index);
        };
        if (this.state.chunkified) {
          return chunkify.range(loopFn, RANGE.length, $scope.experiment.options());
        } else {
          return Promise.resolve(this._blockingRange(loopFn));
        }
      },

      _blockingRange(loopFn: (index: number) => void): void {
        for (let index = 0; index < RANGE.length; index++) {
          loopFn(index);
        }
      },

    };

    // some metaprogramming to avoid boilerplate
    for (let action of $scope.actions.names) {
      $scope.actions[action] = _.flowRight(
      function(promise: Promise<void|number|number[]>): void {
        $scope.actions._afterAction(promise);
      },
      function(options: {[key: string]: any}): () => Promise<void|number|number[]> {
        return $scope.actions[`_${action}`](options);
      },
      function(options: {[key: string]: any}): {[key: string]: any} {
        return $scope.actions._beforeAction(action, options);
      });
    }
  }, 
]);
