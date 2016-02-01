import {
  parseOptions,
  DEFAULT_OPTIONS,
} from './options';
import {expect} from 'chai';


describe('options', () => {

  it('should throw when receiving non-object literal options', () => {
    let wrongTypes = [
      false,
      true,
      null,
      undefined,
      [],
      new Function(),
    ];
    for (let thing of wrongTypes) {
      expect(() => { parseOptions(thing); })
        .throws(TypeError, `Expected plain javascript object, got ${typeof thing}`);
    }
  });

  it('should have defaults', () => {
    expect(parseOptions({})).to.deep.equal(DEFAULT_OPTIONS);
  });

  it('should override all defaults', () => {
    let chunk = 50;
    let delay = 100;
    let scope = {};

    let passedOptions = {chunk, delay, scope};
    let parsedOptions = parseOptions(passedOptions);

    expect(parsedOptions).to.deep.equal(passedOptions);
  });

  it('should override some defaults', () => {
    let chunk = 54321;
    let delay = 12345;
    let scope = {};
    let parsedOptions: IChunkifyOptions;

    parsedOptions = parseOptions({chunk});

    expect(parsedOptions.chunk).to.equal(chunk);
    expect(parsedOptions.scope).to.equal(DEFAULT_OPTIONS.scope);
    expect(parsedOptions.delay).to.equal(DEFAULT_OPTIONS.delay);

    parsedOptions = parseOptions({delay, scope});

    expect(parsedOptions.delay).to.equal(delay);
    expect(parsedOptions.scope).to.equal(scope);
    expect(parsedOptions.chunk).to.equal(DEFAULT_OPTIONS.chunk);

    parsedOptions = parseOptions({scope});

    expect(parsedOptions.scope).to.equal(scope);
    expect(parsedOptions.chunk).to.equal(DEFAULT_OPTIONS.chunk);
    expect(parsedOptions.delay).to.equal(DEFAULT_OPTIONS.delay);
  });

  it('should ignore unknown options', () => {
    let chunk = 50;
    let delay = 100;
    let scope = {};
    let ignoredOption = '';

    let passedOptions = {chunk, delay, scope, ignoredOption};
    let parsedOptions = parseOptions(passedOptions);

    expect(parsedOptions).to.not.haveOwnProperty('ignoredOption');
    expect(parsedOptions).to.deep.equal({chunk, delay, scope});
  });

  it('should throw when an option override has the wrong type', () => {
    let chunk = function() {};
    let delay = [];
    let scope = false;

    expect(() => { parseOptions({chunk}); }).throws(TypeError, /'chunk' should be a positive number/);
    expect(() => { parseOptions({delay}); }).throws(TypeError, /'delay' should be a non-negative number/);
    expect(() => { parseOptions({scope}); }).throws(TypeError, /'scope' should not be undefined, a boolean, or a number/);
  });

  it('should throw when an option override has right type and wrong value', () => {
    let chunk = -1;
    let delay = -1;

    expect(() => { parseOptions({chunk}); }).throws(TypeError, /'chunk' should be a positive number/);
    expect(() => { parseOptions({delay}); }).throws(TypeError, /'delay' should be a non-negative number/);
  });

  it('should be immutable', () => {
    let chunk = 54321;
    let delay = 12345;
    let scope = {};

    let parsedOptions = parseOptions({chunk, delay, scope});

    expect(() => { parsedOptions.delay = 0; }).throws(/Cannot assign to read only property 'delay'/);
    expect(() => { parsedOptions.chunk = 1; }).throws(/Cannot assign to read only property 'chunk'/);
    expect(() => { parsedOptions.scope = this; }).throws(/Cannot assign to read only property 'scope'/);

    expect(() => { delete parsedOptions.delay; }).throws(/Cannot delete property 'delay'/);
    expect(() => { delete parsedOptions.chunk; }).throws(/Cannot delete property 'chunk'/);
    expect(() => { delete parsedOptions.scope;  }).throws(/Cannot delete property 'scope'/);

    expect(parsedOptions.delay).to.exist;
    expect(parsedOptions.chunk).to.exist;
    expect(parsedOptions.scope).to.exist;
  });

});
