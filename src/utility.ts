export var forOwn = (iteratee, iterator: Function): void => {
  for (let key in iteratee) {
    if (iteratee.hasOwnProperty(key)) {
      iterator(iteratee[key], key);
    }
  }
};

export var isBoolean = (thing): boolean => {
  return typeof thing === 'boolean';
};

export var isNumber = (thing): boolean => {
  return typeof thing === 'number';
};

export var defaults = (defaultsObj: Object, overrideObj: Object): Object => {
  forOwn(overrideObj, (value, key: string) => {
    if (!defaultsObj.hasOwnProperty(key)) {
      defaultsObj[key] = overrideObj[key];
    }
  });
  return defaultsObj;
};

export var extend = <T extends Object, U extends Object>(
  targetObj: T,
  sourceObj: U
): T|U => {
  forOwn(sourceObj, (value, key) => {
    targetObj[key] = sourceObj[key];
  });
  return targetObj;
};

export var assertNonemptyArray = function(thing): void {
  if (!Array.isArray(thing) || !thing.length) {
    throw new TypeError(`Expected non-empty array, got ${typeof thing}`);
  }
};

let isFunction = function(thing): boolean {
  return typeof thing === 'function';
};

export var assertIsPlainObject = function(thing): void {
  let isPlainObject = function() {
    // slightly modified from:
    //
    //    https://github.com/lodash/lodash/blob/master/lodash.js#L9976
    let isObjectLike = () => {
      return !!thing && typeof thing === 'object';
    };
    let objectProto = Object.prototype;
    if (!isObjectLike() || objectProto.toString.call(thing) !== '[object Object]') {
      return false;
    }
    let proto = objectProto;
    if (isFunction(thing.constructor)) {
      proto = Object.getPrototypeOf(thing);
    }
    if (!proto) {
      return true;
    }
    let fnToString = Function.prototype.toString;
    let ctor = proto.constructor;
    return (isFunction(ctor) &&
      ctor instanceof ctor &&
      fnToString.call(ctor) === fnToString.call(Object));
  };
  if (!isPlainObject()) {
    throw new TypeError(`Expected plain javascript object, got ${typeof thing}`);
  }
};

export var assertNumber = function(thing): void {
  if (!isNumber(thing)) {
    throw new TypeError(`Expected number, got ${typeof thing}`);
  }
};

export var assertFn = function(thing): void {
  if (!isFunction(thing)) {
    throw new TypeError(`Expected function, got ${typeof thing}`);
  }
};


let slice = [].slice;

export var compose = <T, U, V, W, X>(
  f: (u: U, ...fOtherArgs: X[]) => V,
  g: (t: T, ...gOtherArgs: W[]) => U
): (t: T, ...gOtherArgs: W[]) => V => {
  assertFn(f);
  assertFn(g);
  return function() {
    return f(g.apply(this, slice.call(arguments)));
  };
};
