import {generator} from './generator';
import {expect} from 'chai';
import {now} from './test-utility';
import {stub} from 'sinon';
import proxyquire from 'proxyquire';


describe('generator', () => {

  // FIXME (?): these tests are non-deterministic
  const DELAY = 10;
  const TOLERANCE = 5;

  it('should throw when not given a number "start" index', () => {
    for (let start of [
      undefined,
      null,
      'string',
      {},
      [],
    ]) {
      expect(() => { generator(start); })
        .throws(/Expected number, got /);
    }
  });

  it('should throw when not given a number "final" index', () => {
    for (let final of [
      undefined,
      null,
      'string',
      {},
      [],
    ]) {
      expect(() => { generator(0, final); })
        .throws(/Expected number, got /);
    }
  });

  it('should delegate options parsing', () => {
    let options = {};
    let parseOptions = stub();

    let {generator} = proxyquire('./generator', {
      './options': {parseOptions}
    });

    generator(0, 10, options);

    expect(parseOptions.calledWithExactly(options)).to.be.ok;
  });

  it('should yield IPause after "chunk" iterations resolving in "delay" milliseconds', done => {
    let iter = generator(0, 3, {chunk: 2, delay: DELAY});

    expect(iter.next()).to.deep.equal({done: false, value: 0});
    expect(iter.next()).to.deep.equal({done: false, value: 1});

    let pause: number|IPause = iter.next().value;
    let started: number = now();
    let elapsed: number;

    expect(pause.resume).to.exist;

    pause
      .resume(function() {
        elapsed = now() - started;
        expect(elapsed >= DELAY).to.be.ok;
        expect(elapsed <= DELAY + TOLERANCE).to.be.ok;
        expect(iter.next()).to.deep.equal({done: false, value: 2});
        expect(iter.next()).to.deep.equal({done: true, value: undefined});
        done();
      })
      .catch(done);
  });

  it('should throw an error if advanced while delay is pending', () => {
    let iter = generator(0, 3, {chunk: 2, delay: 100});

    iter.next();
    iter.next();
    iter.next(); // enters paused state

    expect(() => { iter.next(); }).throws(/paused at index 2; wait 100 milliseconds/);
  });

  it('should yield IPause after "chunk" iterations from a given "start" resolving in "delay" milliseconds', done => {
    let iter = generator(1, 4, {chunk: 2, delay: 10});

    expect(iter.next()).to.deep.equal({done: false, value: 1});
    expect(iter.next()).to.deep.equal({done: false, value: 2});

    let pause: number|IPause = iter.next().value;
    let started: number = now();
    let elapsed: number;

    expect(pause.resume).to.exist;

    pause
      .resume(function() {
        elapsed = now() - started;
        expect(elapsed >= DELAY).to.be.ok;
        expect(elapsed <= DELAY + TOLERANCE).to.be.ok;
        expect(iter.next()).to.deep.equal({done: false, value: 3});
        expect(iter.next()).to.deep.equal({done: true, value: undefined});
        done();
      })
      .catch(done);
  });

  it('should throw an error if advanced while delay is pending from a given "start"', () => {
    let iter = generator(1, 4, {chunk: 2, delay: 100});

    iter.next();
    iter.next();
    iter.next(); // enters paused state

    expect(() => { iter.next(); }).throws(/paused at index 3; wait 100 milliseconds/);
  });

});
