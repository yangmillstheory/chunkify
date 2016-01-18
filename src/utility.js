let isTypeFn = typeName => {
  return thing => {
    return typeof thing === typeName;
  };
}

let forOwn = (iteratee, iterator) => {
  for (let key in iteratee) {
    if (iteratee.hasOwnProperty(key)) {
      iterator(iteratee[key], key);
    }
  }
};

exports.isFunction = isTypeFn('function');
exports.isBoolean = isTypeFn('boolean');
exports.isNumber = isTypeFn('number');
exports.isPlainObject = thing => {
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
  let functToString = Function.prototype.toString;
  let ctor = proto.constructor;
  return (exports.isFunction(ctor) &&
    ctor instanceof ctor &&
    functToString.call(ctor) === functToString.call(Object));
}

exports.defaults = (defaultsObj, overridesObj) => {
  forOwn(overridesObj, (value, key) => {
    if (!defaultsObj.hasOwnProperty(key)) {
      defaultsObj[key] = overridesObj[key];
    }
  });
  return defaultsObj
}

exports.extend = (targetObj, sourceObj) => {
  forOwn(sourceObj, (value, key) => {
    targetObj[key] = sourceObj[key];
  });
  return targetObj
}

exports.compose = (f, g, context) => {
  return function() {
    return f.call(context, g.apply(context, [].slice.call(arguments)));
  };
};