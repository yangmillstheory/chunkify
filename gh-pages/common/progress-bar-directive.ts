import 'jquery/progressbar';


interface IProgressBarScope extends ng.IScope {
  max: number;
  progress: number;
}

/**
 * Create a jQuery progressbar bound to some external progress.
 *
 * @restrict E
 * @scope
 * @param {number} max: the maximum value of the progressbar
 * @param {number} progress: the current progress of the progressbar
 * @requires jquery/progressbar
 */
export var progressBar = function(): ng.IDirective {
  return {
    restrict: 'E',
    scope: {
      max: '=',
      progress: '='
    },
    link(scope: IProgressBarScope, element: ng.IAugmentedJQuery): void {
      let $progressBar = element
        .find('#progress-bar')
        .eq(0)
        .progressbar({value: 0, max: scope.max});

      scope.$watch('progress', function(progress: number): void {
        $progressBar.progressbar('option', 'value', progress);
      });
    },
    template:
      `<div class="progress-bar-container">
        <div id="progress-bar"></div>
      </div>`
  };
};
