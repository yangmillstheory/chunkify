interface IExperimentOptionsScope {
  delay: number;
  chunk: number;
  initialDelay: number;
  initialChunk: number;
  iterations: number;
  disabled(): boolean;
}

interface IExperimentOptionsCtrl {
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
    controller(): void {
      let self: IExperimentOptionsCtrl;

      self.reset = function(): void {
        this.chunk = this.initialChunk;
        this.delay = this.initialDelay;
      };

      Object.assign(this, self);
    },
    controllerAs: 'options',
    link(scope: IExperimentOptionsScope): void {
      scope.initialChunk = scope.chunk;
      scope.initialDelay = scope.delay;
    },
    template:
      `<div class="blurb">
        <dl>
          <section>
            <dt>Iterations</dt>
            <dd>{{ options.iterations }}</dd>
          </section>
        </dl>
        <form name="form">
          <section>
            <label for="chunk">chunk size</label>
            <input class="form-control" type="number" required ng-disabled="form.$invalid || options.disabled()"
                   name="chunk" min="50" max="1000" 
                   ng-model="options.chunk" />
          </section>
          <section>
            <label for="delay">delay time</label>
            <input class="form-control" type="number" required ng-disabled="form.$invalid || options.disabled()"
                   name="delay" min="10" max="100" 
                   ng-model="options.delay" />
          </section>
          <a ng-click="options.reset()">reset</a>
        </form>
      </div>`
  };
};
