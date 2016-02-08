import * as jQuery from 'jquery';


let $ = jQuery.fn.constructor;

interface IResizingContainerAttrs {
  minWidth: string;
  minHeight: string;
  xPadding: string;
  yPadding: string;
}


/**
 * A div container that resizes to fill the window viewport.
 *
 * @restrict E
 * @param {number} minWidth:  the minimum width to resize to
 * @param {number} minHeight: the minimum height to resize to
 * @param {number} xPadding: subtracted from the resize width
 * @param {number} yPadding: subtracted from the resize height
 */
export var resizingContainer = function($window: ng.IWindowService): ng.IDirective {
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    scope: false,
    link(
      scope: ng.IScope,
      element: ng.IAugmentedJQuery,
      attrs: IResizingContainerAttrs
    ): void {
      let minWidth = parseInt(attrs.minWidth, 10);
      let minHeight = parseInt(attrs.minHeight, 10);
      let xPadding = parseInt(attrs.xPadding, 10);
      let yPadding = parseInt(attrs.yPadding, 10);
      let documentElement = $window.document.documentElement;
      let $element = $(element);
      let resize = function(): boolean {
        $element.css({
          width: Math.max(documentElement.clientWidth - xPadding, minWidth),
          height: Math.max(documentElement.clientHeight - yPadding, minHeight)
        });
        return true;
      };
      $window.onresize = resize;
      $window.onresize(null);
    },
    template: `<div class='resizing-container' ng-transclude></div>`
  };
};
