import {expect} from 'chai';
import {spy} from 'sinon';
import {interval} from './interval';
import {tick} from '../test-utility';


describe('interval', () => {

  it('should require a function', () => {
    for (let fn of [
      1,
      'string',
      {},
      [],
      null,
      undefined,
    ]) {
      expect(() => { interval(fn); }).throws(/Expected function; got /);
    }
  });

  it('should require a number start index', () => {
    for (let start of [
      function() {},
      'string',
      {},
      [],
      null,
      undefined,
    ]) {
      expect(() => { interval(spy(), start); }).throws(/Expected number; got /);
    }
  });

  it('should require a number final index', () => {
    for (let final of [
      function() {},
      'string',
      {},
      [],
      null,
      undefined,
    ]) {
      expect(() => { interval(spy(), 0, final); }).throws(/Expected number; got /);
    }
  });

  it('should require start to be less than final', () => {
    expect(() => { interval(spy(), 1, 0); }).throws(/Expected start 1 to be less than final 0/);
    expect(() => { interval(spy(), 0, 0); }).throws(/Expected start 0 to be less than final 0/);
  });

  it('should return a promise', () => {
    expect(interval(() => {}, 0, 1)).to.be.instanceOf(Promise);
  });

  it('should invoke fn the correct number of times', done => {
    let fn = spy();

    interval(fn, 1, 4, {chunk: 3})
      .then(() => {
        expect(fn.callCount).to.equal(3);
        done();
      })
      .catch(done);
  });

  it('should invoke fn with a default scope', done => {
    let fn = spy();

    interval(fn, 1, 4, {chunk: 3})
      .then(() => {
        expect(fn.alwaysCalledOn(null)).to.be.ok;
        done();
      })
      .catch(done);
  });

  it('should invoke fn with a provided scope', done => {
    let fn = spy();
    let scope = spy();

    interval(fn, 1, 4, {chunk: 3, scope})
      .then(() => {
        expect(fn.alwaysCalledOn(scope)).to.be.ok;
        done();
      })
      .catch(done);
  });

  it('should invoke fn with the correct loop index', done => {
    let fn = spy();

    interval(fn, 1, 4, {chunk: 3})
      .then(() => {
        expect(fn.callCount).to.equal(3);
        expect(fn.getCall(0).calledWithExactly(1)).to.be.ok;
        expect(fn.getCall(1).calledWithExactly(2)).to.be.ok;
        expect(fn.getCall(2).calledWithExactly(3)).to.be.ok;
        done();
      })
      .catch(done);
  });

  it('should yield for at least "delay" ms after "chunk" iterations', done => {
    let fn = spy();

    tick({
      delay: 9,

      before() {
        interval(fn, 1, 5, {chunk: 3, delay: 10});
        expect(fn.callCount).to.equal(3);
      },

      after() {
        // no more invocations
        expect(fn.callCount).to.equal(3);
        done();
      },
    });
  });

  it('should start again after "delay" milliseconds', done => {
    let fn = spy();

    tick({
      delay: 11,

      before() {
        interval(fn, 1, 5, {chunk: 3, delay: 10});
        expect(fn.callCount).to.equal(3);
      },

      after() {
        expect(fn.callCount).to.equal(4);
        expect(fn.lastCall.calledWithExactly(4));
        done();
      },
    });
  });

  it('should resolve with undefined', done => {
    let fn = spy();

    tick({
      delay: 11,

      before() {
        let promise = interval(fn, 1, 5, {chunk: 3, delay: 10});
        expect(fn.callCount).to.equal(3);
        return promise;
      },

      after(promise) {
        expect(fn.callCount).to.equal(4);
        promise
          .then(result => {
            expect(result).not.to.exist;
            done();
          })
          .catch(done);
      },
    });
  });

  it('should reject the promise with rejection object and stop processing', done => {
    let error = new Error('example error');
    let fn = spy(index => {
      if (index === 2) {
        throw error;
      }
    });

    interval(fn, 1, 5, {chunk: 3})
      .then(null, rejection => {
        expect(rejection).to.deep.equal({error, index: 2});
        expect(fn.callCount).to.equal(2);
        done();
      })
      .catch(done);
  });

  it('should not yield after "chunk" iterations if processing is complete', done => {
    let fn = spy();

    tick({
      delay: 20,

      before() {
        interval(fn, 1, 4, {chunk: 3, delay: 10});
        expect(fn.callCount).to.equal(3);
      },

      after() {
        expect(fn.callCount).to.equal(3);
        done();
      },
    });
  });
});

