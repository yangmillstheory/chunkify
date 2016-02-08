import * as $ from 'jquery';


const ANIMATE_SPEED = 400;
const TRANSPARENT_OPACITY = 0.5;


let randomInt = function(options: {max?: number, min?: number} = {}): number {
  let isNumber = function(thing: any): boolean {
    return typeof thing === 'number';
  };
  const defaultMax = Math.pow(10, 2);
  const defaultMin = defaultMax * .75;
  let min = isNumber(options.min) ? options.min : defaultMin;
  let max = isNumber(options.max) ? options.max : defaultMax;
  return Math.floor(Math.random() * (max - min) + min);
};

interface IMoveCSS {
  top?: string;
  left?: string;
  opacity?: number;
}

interface IMoveFunction {
  (): IMoveCSS;
}


function* wispMoves($element: ng.IAugmentedJQuery): IterableIterator<IMoveCSS> {
  let $parent = $element.parent();
  let xOffset = function(): number {
    let width = $parent.width();
    return randomInt({min: 0.25 * width, max: width});
  };
  let yOffset = function(): number {
    let height = $parent.height();
    return randomInt({min: 0.25 * height, max: height});
  };
  let moveFunctions: IMoveFunction[] = [
    function moveRight(): IMoveCSS {
      let maxOffset = ($parent.offset().left + $parent.width()) - ($element.offset().left + $element.width());
      return {left: `+=${Math.min(xOffset(), maxOffset)}`};
    },
    function moveDown(): IMoveCSS {
      let maxOffset = ($parent.offset().top + $parent.height()) - ($element.offset().top + $element.height());
      return {top: `+=${Math.min(yOffset(), maxOffset)}`};
    },
    function moveLeft(): IMoveCSS {
      let maxOffset = $element.offset().left - $parent.offset().left;
      return {left: `-=${Math.min(xOffset(), maxOffset)}`};
    },
    function moveUp(): IMoveCSS {
      let maxOffset = $element.offset().top - $parent.offset().top;
      return {top: `-=${Math.min(yOffset(), maxOffset)}`};
    }
  ];
  let randomMove = function(): IMoveCSS {
    let moveCssMaker = moveFunctions[randomInt({min: 0, max: moveFunctions.length})];
    return moveCssMaker();
  };
  while (true) {
    yield randomMove();
  }
}

export var wisp = function($interval: ng.IIntervalService): ng.IDirective {
  return {
    replace: true,
    link(scope: ng.IScope, element: ng.IAugmentedJQuery): void {
      let $element = $.fn.constructor(element);
      let moves = wispMoves($element);
      let animate = function(transparent?: boolean): void {
        let moveCSS = moves.next().value;
        if (transparent) {
          moveCSS.opacity = TRANSPARENT_OPACITY;
        } else {
          moveCSS.opacity = 1;
        }
        $element.animate(
          moveCSS,
          ANIMATE_SPEED,
          function(): void {
            animate(!transparent);
          }
        );
      };
      animate();
    },
    template: '<div id="wisp"></div>'
  };
};
