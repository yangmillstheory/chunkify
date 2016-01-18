import interval from './interval'
import {
  isFunction,
  isNumber
} from '../utility'



let checkUsage = (fn, range) => {
  if (!isFunction(fn)) {
    throw new Error(`${USAGE} - bad fn; not a function`);
  } else if (!isNumber(range)) {
    throw new Error(`${USAGE} - bad range; not a number`);
  }
};

  checkUsage(fn, range);
};

export default range