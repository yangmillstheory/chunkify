import {map} from './map';
import {spy, stub} from 'sinon';
import {expect} from 'chai';
import proxyquire from 'proxyquire';
import {tick} from '../test-utility';


describe('map', () => {

  it('should require a function', () => {
    expect(() => { map([1, 2, 3]); }).throws(/Expected function, got/);
  });

  it('should require an array', () => {
    expect(() => { map(null, () => {}); }).throws(/Expected array, got/);
  });

  // so for everything that applies to 
  // tArray & options testing, cf. each.spec.ts
  it('should delegate tArray and options to each', () => {
    let each = stub().returns({then: stub()});
    let {map} = proxyquire('./map', {
      './each': {each}
    });

    let tArray = [1, 2, 3];
    let options = {};
    map(tArray, stub(), options);

    expect(each.calledOnce).to.be.ok;
    expect(each.lastCall.args[0]).to.equal(tArray);
    expect(each.lastCall.args[1]).to.be.instanceOf(Function);
    expect(each.lastCall.args[2]).to.equal(options);
  });

  it('should return a promise', () => {
    expect(map([1, 2, 3], spy())).to.be.instanceOf(Promise);
  });


  //////////////////////////////////////
  // test behavior around tMapper, since 
  // it's not directly passed to each

  it('should invoke tMapper with the default scope', done => {
    let tMapper = spy();

    map(['A', 'B', 'C'], tMapper, {chunk: 3})
      .then(() => {
        expect(tMapper.calledThrice).to.be.ok;
        expect(tMapper.alwaysCalledOn(null)).to.be.ok;
        done();
      })
      .catch(done);
  });

  it('should invoke tMapper with the provided scope', done => {
    let tMapper = spy();
    let scope = {};

    map(['A', 'B', 'C'], tMapper, {chunk: 3, scope})
      .then(() => {
        expect(tMapper.calledThrice).to.be.ok;
        expect(tMapper.alwaysCalledOn(scope)).to.be.ok;
        done();
      })
      .catch(done);
  });

  it('should invoke tMapper with the array item and index', done => {
    let tMapper = spy();

    map(['A', 'B', 'C'], tMapper, {chunk: 3})
      .then(() => {
        expect(tMapper.callCount).to.equals(3);
        expect(tMapper.getCall(0).args).to.deep.equal(['A', 0]);
        expect(tMapper.getCall(1).args).to.deep.equal(['B', 1]);
        expect(tMapper.getCall(2).args).to.deep.equal(['C', 2]);
        done();
      })
      .catch(done);
  });

  it('should yield for at least "delay" ms after "chunk" iterations', done => {
    let tMapper = spy();

    tick({
      delay: 9,

      before() {
        map(['A', 'B', 'C', 'D'], tMapper, {chunk: 3, delay: 10});
        expect(tMapper.callCount).to.equal(3);
      },

      after() {
        // no new calls
        expect(tMapper.callCount).to.equal(3);
        done();
      },
    });
  });

  it('should start again after `delay` milliseconds from last yielding', done => {
    let tMapper = spy();

    tick({
      delay: 11,

      before() {
        map(['A', 'B', 'C', 'D'], tMapper, {chunk: 3, delay: 10});
        expect(tMapper.callCount).to.equal(3);
      },

      after() {
        expect(tMapper.callCount).to.equal(4);
        expect(tMapper.getCall(3).args).to.deep.equal(['D', 3]);
        done();
      },
    });
  });

  it('should resolve with the mapped array', done => {
    let tMapper = spy(letter => {
      return letter.toLowerCase();
    });

    tick({
      delay: 11,

      before() {
        let mapPromise = map(['A', 'B', 'C', 'D'], tMapper, {chunk: 3, delay: 10});
        expect(tMapper.callCount).to.equal(3);
        return mapPromise;
      },

      after(mapPromise) {
        expect(tMapper.callCount).to.equal(4);
        mapPromise
          .then(mapped => {
            expect(mapped).to.deep.equal(['a', 'b', 'c', 'd']);
            done();
          })
          .catch(done);
      },
    });
  });

  it('should reject the promise with correct rejection object and stop processing', done => {
    let error = {};
    let tMapper = spy(letter => {
      if (letter === 'B') {
        throw error;
      }
    });

    tick({
      delay: 20,

      before() {
        map(['A', 'B', 'C'], tMapper, {chunk: 3})
          .catch(rejection => {
            expect(rejection).to.deep.equal({error, item: 'B', index: 1});
            expect(tMapper.callCount).to.equal(2);
          });
      },

      after() {
        // no new calls
        expect(tMapper.callCount).to.equal(2);
        done();
      },
    });

  });

  it('should complete with the correct number of calls', done => {
    let tMapper = spy();

    tick({
      delay: 20,

      before() {
        map(['A', 'B', 'C'], tMapper, {chunk: 3, delay: 10});
        expect(tMapper.callCount).to.equal(3);
      },

      after() {
        expect(tMapper.callCount).to.equal(3);
        done();
      },
    });
  });

});

