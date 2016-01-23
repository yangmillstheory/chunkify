export var forOwn = (iteratee, iterator: Function): void => {
  for (let key in iteratee) {
    if (iteratee.hasOwnProperty(key)) {
      iterator(iteratee[key], key);
    }
  }
};

export var isFunction = (thing): boolean => {
  return typeof thing === 'function';
};

export var isBoolean = (thing): boolean => {
  return typeof thing === 'boolean';
};

export var isNumber = (thing): boolean => {
  return typeof thing === 'number';
};

export var isPlainObject = (thing): boolean => {
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
  if (exports.isFunction(thing.constructor)) {
    proto = Object.getPrototypeOf(thing);
  }
  if (!proto) {
    return true;
  }
  let fnToString = Function.prototype.toString;
  let ctor = proto.constructor;
  return (exports.isFunction(ctor) &&
    ctor instanceof ctor &&
    fnToString.call(ctor) === fnToString.call(Object));
};

export var defaults = (defaultsObj: Object, overrideObj: Object): Object => {
  forOwn(overrideObj, (value, key: string) => {
    if (!defaultsObj.hasOwnProperty(key)) {
      defaultsObj[key] = overrideObj[key];
    }
  });
  return defaultsObj;
};

export var extend = (targetObj: Object, sourceObj: Object): Object => {
  forOwn(sourceObj, (value, key) => {
    targetObj[key] = sourceObj[key];
  });
  return targetObj;
};


let slice = [].slice;

export var compose = (f: Function, g: Function, context: Object): Function => {
  return function() {
    return f.call(context, g.apply(context, slice.call(arguments)));
  };
};
