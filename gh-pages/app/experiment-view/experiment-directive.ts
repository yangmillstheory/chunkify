let template =
`<div class="action-code">
  <pre>
// <strong>chunkified</strong> actions keep the animation active.
// un-checking <strong>chunkified</strong> will cause actions to momentarily lock your browser.
const RANGE = _.range(0.5 * Math.pow(10, 5));
<strong>let chunk = {{ experiment.chunk }};</strong>
<strong>let delay = {{ experiment.delay }};</strong>
let simulateWork = function(index: number): void {
  let i = 0;
  let max = largeRandomInteger();
  while (i < max) {
    i++;
  }
};
  </pre>
  <pre>
    {{ experiment.state | chunkifyCode }}
  </pre>
</div>`;


export var experimentView = function(): ng.IDirective {
  return {
    restrict: 'E',
    scope: {
      experiment: '=',
    },
    template
  };
};
