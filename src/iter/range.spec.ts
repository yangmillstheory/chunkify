import proxyquire from 'proxyquire';
import {expect} from 'chai';
import {stub} from 'sinon';



describe('range', () => {

  // so, see interval.spec.ts 
  it('should delegate to interval with a start value of 0', () => {
    let interval = stub();

    let {range} = proxyquire('./range', {
      './interval': {interval}
    });

    let fn = stub();
    let length = 10;
    let options = {};
    range(fn, length, options);

    expect(interval.calledWithExactly(fn, 0, length, options)).to.be.ok;
  });

});
