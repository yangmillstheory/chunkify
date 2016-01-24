import {chunkify} from './chunkify';
import {expect} from 'chai';
import {now} from './test-utility';

describe('chunkify', () => {

  // FIXME (?): these tests are non-deterministic
  const DELAY = 10;
  const TOLERANCE = 5;

  it('should throw when not given a number "start" index', () => {
    for (let start of [undefined, null, 'string', {}, []]) {
      expect(() => { chunkify(start); })
        .throws(/start index "start" of generator range must be a number/);
    }
  });

  it('should throw when not given a number "final" index', () => {
    for (let final of [undefined, null, 'string', {}, []]) {
      expect(() => { chunkify(0, final); })
        .throws(/final index "final" of generator range must be a number/);
    }
  });

  it('should yield Promise<void> after "chunk" iterations resolving in "delay" milliseconds', done => {
    let iter = chunkify(0, 3, {chunk: 2, delay: DELAY});

    expect(iter.next()).to.deep.equal({done: false, value: 0});
    expect(iter.next()).to.deep.equal({done: false, value: 1});

    let promise: number | Promise<void> = iter.next().value;
    let started: number = now();
    let elapsed: number;

    expect(promise instanceof Promise).to.be.ok;

    promise
      .then(() => {
        elapsed = now() - started;
        expect(elapsed >= DELAY).to.be.ok;
        expect(elapsed <= DELAY + TOLERANCE).to.be.ok;
        expect(iter.next()).to.deep.equal({done: false, value: 2});
      })
      .then(done)
      .catch(done);
  });

  it('should throw an error if advanced while delay is pending', () => {
    let iter = chunkify(0, 3, {chunk: 2, delay: 100});

    iter.next();
    iter.next();
    iter.next();  // enters paused state

    expect(() => { iter.next(); }).throws(/paused at index 2; wait 100 milliseconds/);
  });

  it('should yield Promise<void> after "chunk" iterations from a given "start" resolving in delay milliseconds', done => {
    let iter = chunkify(1, 4, {chunk: 2, delay: 10});

    expect(iter.next()).to.deep.equal({done: false, value: 1});
    expect(iter.next()).to.deep.equal({done: false, value: 2});

    let promise: number | Promise<void> = iter.next().value;
    let started: number = now();
    let elapsed: number;

    expect(promise instanceof Promise).to.be.ok;

    promise
      .then(() => {
        elapsed = now() - started;
        expect(elapsed >= DELAY).to.be.ok;
        expect(elapsed <= DELAY + TOLERANCE).to.be.ok;
        expect(iter.next()).to.deep.equal({done: false, value: 3});
        expect(iter.next()).to.deep.equal({done: true, value: undefined});
      })
      .then(done)
      .catch(done);
  });

  it('should throw an error if advanced while delay is pending from a given start', () => {
    let iter = chunkify(1, 4, {chunk: 2, delay: 100});

    iter.next();
    iter.next();
    iter.next();  // enters paused state

    expect(() => { iter.next(); }).throws(/paused at index 3; wait 100 milliseconds/);
  });

});