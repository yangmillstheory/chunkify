import {spy, stub} from 'sinon';
import {expect} from 'chai';
import {each} from './each';
import {tick} from '../test-utility';
import {DEFAULT_OPTIONS} from '../options';
import proxyquire from 'proxyquire';


describe('each', () => {

  it('should require an array', () => {
    expect(each).throws(/Expected non-empty array, got/);
  });

  it('should require a non-empty array', () => {
    expect(() => { each([], stub()); }).throws(/Expected non-empty array, got/);
  });

  it('should require a function', () => {
    expect(() => { each([1, 2, 3]); }).throws(/Expected function, got/);
  });

  it('should delegate a function, array length and options to range', () => {
    let range = stub().returns({
      catch: stub()
    });
    let {each} = proxyquire('./each', {
      '../iter/range': {range}
    });

    let tArray = [1, 2, 3];
    let options = {};
    each(tArray, stub(), options);

    expect(range.calledOnce).to.be.ok;
    expect(range.lastCall.args[0]).to.be.instanceOf(Function);
    expect(range.lastCall.args[1]).to.equal(tArray.length);
    expect(range.lastCall.args[2]).to.equal(options);
  });


  /////////////////////////////////////////
  // test behavior around tConsumer, since 
  // it's not directly passed to iter/range

  it('should invoke tConsumer with the array item and index', done => {
    let tConsumer = spy();

    each(['A', 'B', 'C'], tConsumer, {chunk: 3})
      .then(() => {
        expect(tConsumer.callCount).to.equal(3);
        expect(tConsumer.getCall(0).args).to.deep.equal(['A', 0]);
        expect(tConsumer.getCall(1).args).to.deep.equal(['B', 1]);
        expect(tConsumer.getCall(2).args).to.deep.equal(['C', 2]);
        done();
      })
      .catch(done);
  });

  it('should invoke tConsumer with the default scope', done => {
    let tConsumer = spy();

    each(['A', 'B', 'C'], tConsumer, {chunk: 3})
      .then(() => {
        expect(tConsumer.calledThrice).to.be.ok;
        expect(tConsumer.alwaysCalledOn(DEFAULT_OPTIONS.scope)).to.be.ok;
        done();
      })
      .catch(done);
  });

  it('should invoke tConsumer with a provided scope', done => {
    let tConsumer = spy();
    let scope = {};

    each(['A', 'B', 'C'], tConsumer, {chunk: 3, scope})
      .then(() => {
        expect(tConsumer.calledThrice).to.be.ok;
        expect(tConsumer.alwaysCalledOn(scope)).to.be.ok;
        done();
      })
      .catch(done);
  });

  it('should yield for at least "delay" ms after "chunk" iterations', () => {
    let tConsumer = spy();

    tick({
      delay: 9,

      before() {
        each(['A', 'B', 'C', 'D'], tConsumer, {chunk: 3, delay: 10});
        expect(tConsumer.callCount).to.equal(3);
      },

      after() {
        // no new calls
        expect(tConsumer.callCount).to.equal(3);
      },
    });
  });

  it('should start again after "delay" milliseconds from last yielding', done => {
    let tConsumer = spy();

    tick({
      delay: 11,

      before() {
        each(['A', 'B', 'C', 'D'], tConsumer, {chunk: 3, delay: 10});
        expect(tConsumer.callCount).to.equal(3);
      },

      after() {
        expect(tConsumer.callCount).to.equal(4);
        expect(tConsumer.getCall(3).args).to.deep.equal(['D', 3]);
        done();
      },
    });
  });

  it('should resolve with undefined', done => {
    tick({
      delay: 11,

      before() {
        let eachPromise = each(['A', 'B', 'C', 'D'], spy(), {chunk: 3, delay: 10});
        return eachPromise;
      },

      after(eachPromise) {
        eachPromise
          .then(result => {
            expect(result).to.not.exist;
            done();
          })
          .catch(done);
      },
    });
  });

  it('should reject the promise with the index, error, and item, and stop processing', done => {
    let error = {};
    let tConsumer = spy(letter => {
      if (letter === 'B') {
        throw error;
      }
    });

    tick({
      delay: 20,

      before() {
        each(['A', 'B', 'C'], tConsumer, {chunk: 3, delay: 10})
          .catch(rejection => {
            expect(rejection).to.deep.equal({error, item: 'B', index: 1});
            expect(tConsumer.callCount).to.equal(2);
          });
      },

      after() {
        // no new calls
        expect(tConsumer.callCount).to.equal(2);
        done();
      },
    });

  });

  it('should complete with the correct number of calls', done => {
    let tConsumer = spy();

    tick({
      delay: 20,

      before() {
        each(['A', 'B', 'C'], tConsumer, {chunk: 3, delay: 10});
        expect(tConsumer.callCount).to.equal(3);
      },

      after() {
        expect(tConsumer.callCount).to.equal(3);
        done();
      },
    });
  });

});
