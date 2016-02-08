export var experimentView = function(): ng.IDirective {
  return {
    restrict: 'E',
    scope: {
      experiment: '=',
    },
    template:
`<div class="action-code">
  <pre>
// <strong>chunkified</strong> actions keep the animation active.
// un-checking <strong>chunkified</strong> will cause actions to momentarily lock your browser.
const RANGE = _.range(0.5 * Math.pow(10, 5));
<strong>let chunk = {{ experiment.options.chunk }};</strong>
<strong>let delay = {{ experiment.options.delay }};</strong>
let indexConsumer = function(j: number): number {
  let i = 0;
  let max = largeRandomInt();
  while (i < max) {
    i++;
  }
  return j;
};
  </pre>
  <pre>
{{ experiment | experimentCode }}
  </pre>
</div>`
  };
};
