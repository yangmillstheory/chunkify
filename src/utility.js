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
exports.isObject = isTypeFn('object');

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