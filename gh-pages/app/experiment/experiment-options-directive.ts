interface IExperimentOptionsScope extends ng.IScope {
  experiment: IExperiment;
  form: ng.IFormController;
  initialChunk: number;
  initialDelay: number;
}

interface IExperimentOptionsCtrl {
  disabled(): boolean;
  reset(): void;
}

export var experimentOptions = function(): ng.IDirective {
  return {
    restrict: 'E',
    scope: {
      experiment: '='
    },
    controllerAs: 'optionsCtrl',
    controller($scope: IExperimentOptionsScope): void {
      let api: IExperimentOptionsCtrl = {
        disabled: function(): boolean {
          return $scope.experiment.isRunning() || $scope.form.$invalid;
        },

        reset: function(): void {
          $scope.experiment.options.chunk = $scope.initialChunk;
          $scope.experiment.options.delay = $scope.initialDelay;
        },
      };

      Object.assign(this, api);

    },
    link(scope: IExperimentOptionsScope): void {
      scope.initialChunk = scope.experiment.options.chunk;
      scope.initialDelay = scope.experiment.options.delay;
    },
    template:
      `<div class="blurb">
        <dl>
          <section>
            <dt>Iterations</dt>
            <dd>{{ experiment.length }}</dd>
          </section>
        </dl>
        <form name="form">
          <section>
            <label for="chunk">chunk size</label>
            <input class="form-control" type="number" required ng-disabled="optionsCtrl.disabled()"
                   name="chunk" min="50" max="1000" 
                   ng-model="experiment.options.chunk" />
          </section>
          <section>
            <label for="delay">delay time</label>
            <input class="form-control" type="number" required ng-disabled="optionsCtrl.disabled()"
                   name="delay" min="10" max="100" 
                   ng-model="experiment.options.delay" />
          </section>
          <a ng-click="optionsCtrl.reset()" ng-hide="optionsCtrl.disabled()">reset</a>
        </form>
      </div>`
  };
};
