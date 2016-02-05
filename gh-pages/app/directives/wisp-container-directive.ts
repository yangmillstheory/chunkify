.directive('wispContainer', ['$window', ($window) => {
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    scope: {},
    link(scope, element, attrs) {
      const min_width = parseInt(attrs.minWidth, 10);
      const min_height = parseInt(attrs.minHeight, 10);
      let $element = $(element);
      let resize = () => {
        let width = Math.max($(window).width() - 250, min_width);
        let height = Math.max($(window).height() - 225, min_height);
        $element.css({width, height});
        return true;
      };
      resize();
      $window.onresize = resize;
    },
    template: `<div class='wisp-container' ng-transclude></div>`
  };
}]);