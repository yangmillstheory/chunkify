import sinon from 'sinon'
import each from './each'


let each_from_0_spy = (callback) => {
  callback(sinon.spy(each.from_0, 'apply'));
  each.from_0.restore()
};

export {each_from_0_spy}