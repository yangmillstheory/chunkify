import sinon from 'sinon'
import each from './each'


let each_spy = (callback) => {
  callback(sinon.spy(each, 'apply'));
  each.apply.restore()
};

export {each_spy}