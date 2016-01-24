import {expect} from 'chai';
import {spy, stub} from 'sinon';
import {interval} from './interval';
import {tick} from '../test-utility';
import proxyquire from 'proxyquire';


describe('interval', () => {

  it('should require a function', () => {
    for (let indexConsumer of [
      1,
      'string',
      {},
      [],
      null,
      undefined,
    ]) {
      expect(() => { interval(indexConsumer); }).throws(/Expected function; got /);
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

  it('should delegate options parsing', () => {
    let options = {};
    let parseOptions = stub();

    let {interval} = proxyquire('./interval', {
      '../options': {parseOptions}
    });
    interval(spy(), 0, 1, options);

    expect(parseOptions.calledWithExactly(options)).to.be.ok;
  });

  it('should return a promise', () => {
    expect(interval(() => {}, 0, 1)).to.be.instanceOf(Promise);
  });

  it('should invoke indexConsumer the correct number of times', done => {
    let indexConsumer = spy();

    interval(indexConsumer, 1, 4, {chunk: 3})
      .then(() => {
        expect(indexConsumer.callCount).to.equal(3);
        done();
      })
      .catch(done);
  });

  it('should invoke indexConsumer with a default scope', done => {
    let indexConsumer = spy();

    interval(indexConsumer, 1, 4, {chunk: 3})
      .then(() => {
        expect(indexConsumer.alwaysCalledOn(null)).to.be.ok;
        done();
      })
      .catch(done);
  });

  it('should invoke indexConsumer with a provided scope', done => {
    let indexConsumer = spy();
    let scope = spy();

    interval(indexConsumer, 1, 4, {chunk: 3, scope})
      .then(() => {
        expect(indexConsumer.alwaysCalledOn(scope)).to.be.ok;
        done();
      })
      .catch(done);
  });

  it('should invoke indexConsumer with the correct loop index', done => {
    let indexConsumer = spy();

    interval(indexConsumer, 1, 4, {chunk: 3})
      .then(() => {
        expect(indexConsumer.callCount).to.equal(3);
        expect(indexConsumer.getCall(0).calledWithExactly(1)).to.be.ok;
        expect(indexConsumer.getCall(1).calledWithExactly(2)).to.be.ok;
        expect(indexConsumer.getCall(2).calledWithExactly(3)).to.be.ok;
        done();
      })
      .catch(done);
  });

  it('should yield for at least "delay" ms after "chunk" iterations', done => {
    let indexConsumer = spy();

    tick({
      delay: 9,

      before() {
        interval(indexConsumer, 1, 5, {chunk: 3, delay: 10});
        expect(indexConsumer.callCount).to.equal(3);
      },

      after() {
        // no more invocations
        expect(indexConsumer.callCount).to.equal(3);
        done();
      },
    });
  });

  it('should start again after "delay" milliseconds', done => {
    let indexConsumer = spy();

    tick({
      delay: 11,

      before() {
        interval(indexConsumer, 1, 5, {chunk: 3, delay: 10});
        expect(indexConsumer.callCount).to.equal(3);
      },

      after() {
        expect(indexConsumer.callCount).to.equal(4);
        expect(indexConsumer.lastCall.calledWithExactly(4));
        done();
      },
    });
  });

  it('should resolve with undefined', done => {
    let indexConsumer = spy();

    tick({
      delay: 11,

      before() {
        let promise = interval(indexConsumer, 1, 5, {chunk: 3, delay: 10});
        expect(indexConsumer.callCount).to.equal(3);
        return promise;
      },

      after(promise) {
        expect(indexConsumer.callCount).to.equal(4);
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
    let indexConsumer = spy(index => {
      if (index === 2) {
        throw error;
      }
    });

    interval(indexConsumer, 1, 5, {chunk: 3})
      .catch(rejection => {
        expect(rejection).to.deep.equal({error, index: 2});
        expect(indexConsumer.callCount).to.equal(2);
        done();
      });
  });

  it('should not yield after "chunk" iterations if processing is complete', done => {
    let indexConsumer = spy();

    tick({
      delay: 20,

      before() {
        interval(indexConsumer, 1, 4, {chunk: 3, delay: 10});
        expect(indexConsumer.callCount).to.equal(3);
      },

      after() {
        expect(indexConsumer.callCount).to.equal(3);
        done();
      },
    });
  });
});

