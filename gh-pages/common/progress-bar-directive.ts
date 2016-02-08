import * as $ from 'jquery';
import 'jquery-ui/progressbar';

const STEP_SIZE = 40;

interface IProgressBarScope extends ng.IScope {
  meter: IMetered;
}

/**
 * Create a jQuery progressbar bound to some external progress.
 *
 * @restrict E
 * @scope
 * @param {number} length: the maximum value of the progressbar relative to 0
 * @param {number} progress: the current progress of the progressbar
 * @requires jquery/progressbar
 */
export var progressBar = function(): ng.IDirective {
  return {
    restrict: 'E',
    scope: {
      meter: '='
    },
    link(scope: IProgressBarScope, element: ng.IAugmentedJQuery): void {
      let length = scope.meter.length;
      let chunks = length / STEP_SIZE;

      let $progressBar = $.fn.constructor(element)
        .find('#progress-bar')
        .eq(0)
        .progressbar({value: 0, max: length});

      scope.$watch(
        function(): number {
          return scope.meter.progress;
        },
        function(progress: number): void {
          if (progress % chunks === 0) {
            $progressBar.progressbar('option', 'value', progress);
          }
        }
      );
    },
    template:
      `<div class="progress-bar-container">
        <div id="progress-bar"></div>
      </div>`
  };
};
