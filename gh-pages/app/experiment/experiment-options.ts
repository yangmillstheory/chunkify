.directive('experiment', () => {
  interface IExperimentState {
    progress: number;
    chunk: number;
    delay: number;
  }

  interface IExperimentScope extends angular.IScope {
    state: IExperimentState;

    form: angular.IFormController;

    chunk: {
      min: number,
      max: number,
      label: string
    };

    iterations: {
      value: number;
      label: string;
    };

    delay: {
      min: number;
      max: number;
      label: string;
    };

    inputs: {
      initialChunk: number;
      initialDelay: number;
      disabled: boolean;
      reset: () => void;
    };

    enable: Function;
    disable: Function;
  }
  return {
    scope: {
      state: '=',
      disable: '&',
      enable: '&'
    },
    link(scope: IExperimentScope) {
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
        reset() {
          if (!scope.state.progress) {
            scope.state.chunk = this.initialChunk;
            scope.state.delay = this.initialDelay;
          }
        }
      }
      ;
      scope.$watch(
        'state',
        (state: IExperimentState, prev: IExperimentState) => {
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
        },
        true);
    },
    template:
      `<div class="blurb">
        <dl>
          <section>
            <dt>{{ iterations.label }}</dt>
            <dd>{{ iterations.value }}</dd>
          </section>
        </dl>
        <form name="form">
          <section>
            <label for="chunk">chunk size</label>
            <input class="form-control" type="number" required ng-disabled="inputs.disabled"
                   name="chunk" min="{{ chunk.min }}" max="{{ chunk.max }}" ng-model="state.chunk" />
          </section>
          <section>
            <label for="delay">delay time</label>
            <input class="form-control" type="number" required ng-disabled="inputs.disabled"
                   name="delay" min="{{ delay.min }}" max="{{ delay.max }}" ng-model="state.delay" />
          </section>
          <a ng-click="inputs.reset()">reset</a>
        </form>
      </div>`
  };
});
