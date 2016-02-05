.directive('actionCode', () => {
    return {
      restrict: 'E',
      scope: {
        state: '=',
        chunk: '=',
        delay: '='
      },
      link(scope, element) {
        $(element).find('.action-code').css({
          width: '100%',
          height: '100%'
        });
      },
      template:
        `<div class="action-code">
          <pre>
// <strong>chunkified</strong> actions keep the animation active.
// un-checking <strong>chunkified</strong> will cause actions to momentarily lock your browser.

const RANGE = _.range(0.5 * Math.pow(10, 5));
<strong>let chunk = {{chunk}};</strong>
<strong>let delay = {{delay}};</strong>
let simulateWork = (index) => {
  let i = 0;
  let max = largeRandomInteger();
  while (i < max) {
    i++
  }
  return index
};
          </pre>
          <pre>
            {{state | code}}
          </pre>
        </div>`
    };
})