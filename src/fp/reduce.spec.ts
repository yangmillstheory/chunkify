import {reduce} from './reduce';
import {spy, stub} from 'sinon';
import {expect} from 'chai';
import {DEFAULT_OPTIONS} from '../options';
import proxyquire from 'proxyquire';
import {tick} from '../test-utility';


describe('reduce', () => {

  it('should require an array', () => {
    expect(reduce).throws(/Expected non-empty array, got/);
  });

  it('should require a non-empty array', () => {
    expect(() => { reduce([]); }).throws(/Expected non-empty array, got/);
  });

  it('should require a function', () => {
    expect(() => { reduce([1, 2, 3]); }).throws(/Expected function, got/);
  });

  // so for everything that applies to 
  // tArray & options testing, cf. each.spec.ts
  it('should delegate tArray and options to each', () => {
    let each = stub().returns({then: stub()});
    let {reduce} = proxyquire('./reduce', {
      './each': {each}
    });

    let tArray = [1, 2, 3];
    let options = {};
    reduce(tArray, stub(), options);

    expect(each.calledOnce).to.be.ok;
    expect(each.lastCall.args[0]).to.equal(tArray);
    expect(each.lastCall.args[1]).to.be.instanceOf(Function);
    expect(each.lastCall.args[2]).to.equal(options);
  });

  it('should return a promise', () => {
    expect(reduce([1, 2, 3], spy())).to.be.instanceOf(Promise);
  });


  ///////////////////////////////////////
  // test behavior around tReducer, since 
  // it's not directly passed to each

  it('should invoke tReducer with the default scope', done => {
    let tReducer = spy();

    reduce(['A', 'B', 'C'], tReducer, {chunk: 3})
      .then(() => {
        expect(tReducer.alwaysCalledOn(DEFAULT_OPTIONS.scope)).to.be.ok;
        done();
      })
      .catch(done);
  });

  it('should invoke tReducer with the provided scope', done => {
    let tReducer = spy();
    let scope = {};

    reduce(['A', 'B', 'C'], tReducer, {chunk: 3, scope})
      .then(() => {
        expect(tReducer.alwaysCalledOn(scope)).to.be.ok;
        done();
      })
      .catch(done);
  });

  it('should invoke tReducer with memo, item, index and array', done => {
    let tArray = ['A', 'B', 'C'];
    let tReducer = spy(function(current: number, item: string) {
      return current + item.charCodeAt(0);
    });

    reduce(tArray, tReducer, {chunk: 3}, 100)
      .then(function() {
        expect(tReducer.callCount).to.equal(3);
        expect(tReducer.getCall(0).args).to.deep.equal([
          100,           'A', 0, tArray
        ]);
        expect(tReducer.getCall(1).args).to.deep.equal([
          100 + 65,      'B', 1, tArray
        ]);
        expect(tReducer.getCall(2).args).to.deep.equal([
          100 + 65 + 66, 'C', 2, tArray
        ]);
        done();
      })
      .catch(done);
  });

  it('should use the first element in tArray as the memo when no memo is given', done => {
    let tArray = ['A', 'B', 'C'];
    let tReducer = spy(function(current: string, letter: string) {
      return current.toLowerCase() + letter.toLowerCase();
    });

    reduce(tArray, tReducer, {chunk: 2}).then(function() {
      expect(tReducer.callCount).to.equal(2);
      expect(tReducer.getCall(0).args).to.deep.equal(['A', 'B', 1, tArray]);
      expect(tReducer.getCall(1).args).to.deep.equal(['ab', 'C', 2, tArray]);
      done();
    })
    .catch(done);
  });

  it('should yield for at least "delay" ms after "chunk" iterations', done => {
    let tReducer = spy();

    tick({
      delay: 9,

      before() {
        reduce(['A', 'B', 'C', 'D'], tReducer, {chunk: 3, delay: 10}, '');
        expect(tReducer.callCount).to.equal(3);
      },

      after() {
        // no new calls
        expect(tReducer.callCount).to.equal(3);
        done();
      },
    });
  });

  it('should start again after "delay" milliseconds from last yielding', done => {
    let tReducer = spy(function(memo, letter) {
      return memo + letter;
    });
    let tArray = ['A', 'B', 'C', 'D'];

    tick({
      delay: 11,

      before() {
        reduce(tArray, tReducer, {chunk: 3, delay: 10}, '');
        expect(tReducer.callCount).to.equal(3);
      },

      after() {
        expect(tReducer.callCount).to.equal(4);
        expect(tReducer.getCall(3).args).to.deep.equal(['ABC', 'D', 3, tArray]);
        done();
      },
    });
  });

  it('should resolve with the reduction from a default memo', done => {
    let tReducer = spy((memo, letter, index, tArray) => {
      return `${memo.toLowerCase()}+${letter.toLowerCase()}`;
    });

    tick({
      delay: 11,

      before() {
        let reducePromise = reduce(['A', 'B', 'C', 'D'], tReducer, {chunk: 3, delay: 10});
        expect(tReducer.callCount).to.equal(2);
        return reducePromise;
      },

      after(reducePromise) {
        expect(tReducer.callCount).to.equal(3);
        reducePromise
          .then(result => {
            expect(result).to.deep.equal('a+b+c+d');
            done();
          })
          .catch(done);
      },
    });
  });

  it('should resolve with the reduced result from a given memo', done => {
    let tReducer = spy((memo, letter, index, array) => {
      return `${memo.toLowerCase()}+${letter.toLowerCase()}`;
    });

    tick({
      delay: 11,

      before() {
        let reducePromise = reduce(['A', 'B', 'C', 'D'], tReducer, {chunk: 3, delay: 10}, 'MEMO');
        expect(tReducer.callCount).to.equal(3);
        return reducePromise;
      },

      after(reducePromise) {
        expect(tReducer.callCount).to.equal(4);
        reducePromise
          .then(result => {
            expect(result).to.deep.equal('memo+a+b+c+d');
            done();
          })
          .catch(done);
      },
    });
  });

  it('should reject the promise with rejection object and stop processing', done => {
    let error = {};
    let tReducer = spy((memo, letter) => {
      if (letter === 'B') {
        throw error;
      }
    });

    tick({
      delay: 20,

      before() {
        reduce(['A', 'B', 'C'], tReducer, {chunk: 3}, '')
          .catch(rejection => {
            expect(rejection).to.deep.equal({error, item: 'B', index: 1});
            expect(tReducer.callCount).to.equal(2);
          });
      },

      after() {
        expect(tReducer.callCount).to.equal(2);
        done();
      },
    });

  });

  it('should complete with the correct number of calls', done => {
    let tReducer = spy();

    tick({
      delay: 20,

      before() {
        reduce(['A', 'B', 'C'], tReducer, {chunk: 3, delay: 10}, '');
        expect(tReducer.callCount).to.equal(3);
      },

      after() {
        expect(tReducer.callCount).to.equal(3);
        done();
      },
    });

  });

});
