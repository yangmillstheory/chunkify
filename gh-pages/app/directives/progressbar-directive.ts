.directive('progressbar', () => {
  return {
    restrict: 'E',
    scope: {
      progress: '=progress',
      max: '=max'
    },
    link(scope: {max: number, progress: Function} & angular.IScope, element) {
      let $element = $(element);
      let $bar = $element.find('#progressbar').eq(0).progressbar({
        max: scope.max,
        value: 0
      });
      let progress = value => {
        $bar.progressbar('option', 'value', value);
      };
      scope.$watch('progress', progress);
    },
    template:
      `<div class="progressbar-container">
        <div id="progressbar"></div>
      </div>`
  };
})