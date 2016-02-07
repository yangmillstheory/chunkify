interface IExperimentOptionsScope {
  delay: number;
  chunk: number;
  form: ng.IFormController;
  disabled(): boolean;
}

interface IExperimentOptionsCtrl extends IExperimentOptionsScope {
  reset(): void;
}

export var experimentOptions = function(): ng.IDirective {
  return {
    scope: {
      delay: '=',
      chunk: '=',
      iterations: '=',
      disabled: '=',
    },
    controllerAs: 'options',
    link(scope: IExperimentOptionsScope, e: any, a: any, ctrl: Function): void {
      let initialChunk = scope.chunk;
      let initialDelay = scope.delay;

      let options: IExperimentOptionsCtrl;

      // it's awkward to augment the controller here;
      // we do this pattern so typing will work
      options = {
        form: scope.form,

        delay: scope.delay,
        chunk: scope.chunk,

        disabled(): boolean {
          return scope.disabled() || scope.form.$invalid;
        },

        reset(): void {
          options.chunk = initialChunk;
          options.delay = initialDelay;
        },
      };

      options.reset();

      Object.assign(ctrl, options);
    },
    template:
      `<div class="blurb">
        <dl>
          <section>
            <dt>Iterations</dt>
            <dd>{{ iterations }}</dd>
          </section>
        </dl>
        <form name="form">
          <section>
            <label for="chunk">chunk size</label>
            <input class="form-control" type="number" required ng-disabled="options.disabled()"
                   name="chunk" min="50" max="1000" 
                   ng-model="options.chunk" />
          </section>
          <section>
            <label for="delay">delay time</label>
            <input class="form-control" type="number" required ng-disabled="options.disabled()"
                   name="delay" min="10" max="100" 
                   ng-model="options.delay" />
          </section>
          <a ng-click="options.reset()">reset</a>
        </form>
      </div>`
  };
};
