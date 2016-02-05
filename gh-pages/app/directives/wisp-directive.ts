.directive('wisp', ['$interval', ($interval) => {
  function* shiftsGenerator($element, $parent) {
    let randomHorizontalOffset = () => {
      let width = $parent.width();
      return largeRandomInteger({min: 0.25 * width, max: width});
    };
    let randomVerticalOffset = () => {
      let height = $parent.height();
      return largeRandomInteger({min: 0.25 * height, max: height});
    };
    let shifts = [
      () => {
        let maxHorizontalOffset = ($parent.offset().left + $parent.width()) -
          ($element.offset().left + $element.width());
        return {
          left: `+=${Math.min(randomHorizontalOffset(), maxHorizontalOffset)}`
        };
      },
      () => {
        let maxVerticalOffset = ($parent.offset().top + $parent.height()) -
          ($element.offset().top + $element.height());
        return {
          top: `+=${Math.min(randomVerticalOffset(), maxVerticalOffset)}`
        };
      },
      () => {
        let maxHorizontalOffset = $element.offset().left - $parent.offset().left;
        return {
          left: `-=${Math.min(randomHorizontalOffset(), maxHorizontalOffset)}`};
      },
      () => {
        let maxVerticalOffset = $element.offset().top - $parent.offset().top;
        return {
          top: `-=${Math.min(randomVerticalOffset(), maxVerticalOffset)}`
        };
      }
    ];
    let length = shifts.length;
    while (true) {
      yield shifts[largeRandomInteger({min: 0, max: length})]();
    }
  }
  return {
    replace: true,
    link(scope, element) {
      let $element = $(element);
      let $parent = $element.parent();
      let shifts = shiftsGenerator($element, $parent);
      let animate: (transparent?: boolean) => void;
      animate = (transparent = false) => {
        let css = shifts.next().value;
        if (transparent) {
          _.extend(css, {opacity: 0.5});
        } else {
          _.extend(css, {opacity: 1});
        }
        $element.animate(css, 400, animate.bind(null, !transparent));
      };
      animate();
    },
    template: '<div id="wisp"></div>'
  };
}])
