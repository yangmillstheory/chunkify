import {reduce} from './reduce';
import {spy, stub} from 'sinon';
import {expect} from 'chai';
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
    let tReducer = stub();
    let options = {};
    reduce(tArray, tReducer, options);

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
        expect(tReducer.alwaysCalledOn(null)).to.be.ok;
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
    let tReducer = spy(memo => {
      return memo;
    });

    reduce(tArray, tReducer, {chunk: 3}, 'MEMO')
      .then(() => {
        expect(tReducer.callCount).to.equal(3);
        expect(tReducer.getCall(0).args).to.deep.equal(['MEMO', 'A', 0, tArray]);
        expect(tReducer.getCall(1).args).to.deep.equal(['MEMO', 'B', 1, tArray]);
        expect(tReducer.getCall(2).args).to.deep.equal(['MEMO', 'C', 2, tArray]);
        done();
      })
      .catch(done);
  });

// it('should invoke tReducer with the memo as the first item when no memo is given', () => {
//   let tArray = ['A', 'B', 'C'];
//   let identity = spy(memo => {
//     return memo;
//   });

//   reduce(array, identity, {chunk: 2}).then(() => {
//     // Note the reduced call count!
//     t.equals(identity.callCount, 2);
//     t.deepEqual(identity.getCall(0).args, ['A', 'B', 1, array]);
//     t.deepEqual(identity.getCall(1).args, ['A', 'C', 2, array]);
//     done()
//   })
// });

// it('should yield for at least `delay` ms after `chunk` iterations', () => {
//   let tReducer = spy();

//   tick({
//     delay: 9,

//     beforeTick() {
//       reduce(['A', 'B', 'C', 'D'], tReducer, {memo: '', chunk: 3, delay: 10});
//       t.equals(tReducer.callCount, 3);
//     },

//     afterTick() {
//       t.equals(tReducer.callCount, 3);
//       done();
//     }
//   });
// });

// it('should start again after `delay` milliseconds from last yielding', () => {
//   let tReducer = spy(memo => {
//     return memo
//   });
//   let tArray = ['A', 'B', 'C', 'D'];

//   tick({
//     delay: 11,

//     beforeTick() {
//       reduce(array, tReducer, {memo: '', chunk: 3, delay: 10});
//       t.equals(tReducer.callCount, 3);
//     },

//     afterTick() {
//       t.equals(tReducer.callCount, 4);
//       t.deepEqual(tReducer.getCall(3).args, ['', 'D', 3, array]);
//       done();
//     }
//   });
// });

// it('should resolve with the reduced result from a default memo', () => {
//   let tReducer = spy((memo, letter, index, array) => {
//     return `${memo.toLowerCase()}+${letter.toLowerCase()}`
//   });

//   tick({
//     delay: 11,

//     beforeTick() {
//       let promise = reduce(['A', 'B', 'C', 'D'], tReducer, {chunk: 3, delay: 10});
//       t.equals(tReducer.callCount, 2);
//       return promise
//     },

//     afterTick(promise) {
//       t.equals(tReducer.callCount, 3);
//       promise.then((result) => {
//         t.deepEquals(result, 'a+b+c+d');
//         done()
//       })
//     }
//   });
// });

// it('should resolve with the reduced result from a given memo', () => {
//   let tReducer = spy((memo, letter, index, array) => {
//     return `${memo.toLowerCase()}+${letter.toLowerCase()}`
//   });

//   tick({
//     delay: 11,

//     beforeTick() {
//       let promise = reduce(
//         ['A', 'B', 'C', 'D'], tReducer, {chunk: 3, delay: 10, memo: 'MEMO'});
//       t.equals(tReducer.callCount, 3);
//       return promise
//     },

//     afterTick(promise) {
//       t.equals(tReducer.callCount, 4);
//       promise.then((result) => {
//         t.deepEquals(result, 'memo+a+b+c+d');
//         done()
//       })
//     }
//   });
// });

// it('should reject the promise with rejection object and stop processing', () => {
//   let error = {};
//   let tReducer = spy((memo, letter) => {
//     if (letter === 'B') {
//       throw error;
//     }
//   });

//   reduce(['A', 'B', 'C'], tReducer, {chunk: 3, memo: ''}).then(null, (rejection) => {
//     t.deepEquals(rejection, {error, item: 'B', index: 1});
//     t.equals(tReducer.callCount, 2);
//     done()
//   })
// });

// it('should not yield after `chunk` iterations if processing is complete', () => {
//   let tReducer = spy();

//   tick({
//     delay: 20,

//     beforeTick() {
//       reduce(['A', 'B', 'C'], tReducer, {chunk: 3, delay: 10, memo: ''});
//       t.equals(tReducer.callCount, 3)
//     },

//     afterTick() {
//       t.equals(tReducer.callCount, 3);
//       done()
//     }
//   });
// });
});
