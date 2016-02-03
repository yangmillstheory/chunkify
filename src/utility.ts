interface IPojo {
  [key: string]: any;
}


export var forOwn = function(iterable: IPojo, iterator: Function): void {
  for (let key in iterable) {
    if (iterable.hasOwnProperty(key)) {
      iterator(iterable[key], key);
    }
  }
};

export var isBoolean = function(thing: any): boolean {
  return typeof thing === 'boolean';
};

export var isNumber = function(thing: any): boolean {
  return typeof thing === 'number';
};

export var defaults = function(defaultsObj: IPojo, overrideObj: IPojo): Object {
  forOwn(overrideObj, function(value: any, key: string): void {
    if (!defaultsObj.hasOwnProperty(key)) {
      defaultsObj[key] = overrideObj[key];
    }
  });
  return defaultsObj;
};

export var extend = function<T extends IPojo, U extends IPojo>(
  targetObj: T,
  sourceObj: U
): T|U {
  forOwn(sourceObj, function(value: any, key: string): void {
    targetObj[key] = sourceObj[key];
  });
  return targetObj;
};

export var assertNonemptyArray = function(thing: any): void {
  if (!Array.isArray(thing) || !thing.length) {
    throw new TypeError(`Expected non-empty array, got ${typeof thing}`);
  }
};

let isFunction = function(thing: any): boolean {
  return typeof thing === 'function';
};

export var assertIsPlainObject = function(thing: any): void {
  let isPlainObject = function(): boolean {
    // slightly modified from:
    //
    //    https://github.com/lodash/lodash/blob/master/lodash.js#L9976
    let isObjectLike = function(): boolean {
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

export var assertNumber = function(thing: any): void {
  if (!isNumber(thing)) {
    throw new TypeError(`Expected number, got ${typeof thing}`);
  }
};

export var assertFn = function(thing: any): void {
  if (!isFunction(thing)) {
    throw new TypeError(`Expected function, got ${typeof thing}`);
  }
};


let slice = [].slice;

export var compose = function<T, U, V, W, X>(
  f: (u: U, ...fOtherArgs: X[]) => V,
  g: (t: T, ...gOtherArgs: W[]) => U
): (t: T, ...gOtherArgs: W[]) => V {
  assertFn(f);
  assertFn(g);
  return function(): V {
    return f(g.apply(this, slice.call(arguments)));
  };
};
