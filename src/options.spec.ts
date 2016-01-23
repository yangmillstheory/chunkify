import {parseOptions} from './options';
import {expect} from 'chai';


describe('options', () => {
  
  it('should throw when receiving non-object literal options', () => {
    let wrongTypes = [
      false,
      true,
      null,
      undefined,
      [],
      function() {}
    ];
    for (let thing of wrongTypes) {
      expect(() => { parseOptions(thing) })
        .throws(TypeError, `Expected plain javascript object, got ${typeof thing}`);
    }
  });
  
  it('should have defaults', () => {
    let options = parseOptions({});
    
    expect(options).to.deep.equal({
      delay: 0,
      chunk: 1,
      scope: null
    });
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
  let chunk = 50;
  let delay = 100;
  let scope = {};
  let parsedOptions: IChunkifyOptions;

  parsedOptions = parseOptions({chunk});

  expect(parsedOptions.chunk).to.equal(chunk);
  expect(parsedOptions.scope).to.not.equal(scope);
  expect(parsedOptions.delay).to.not.equal(delay);

  parsedOptions = parseOptions({delay, scope});

  expect(parsedOptions.delay).to.equal(delay);
  expect(parsedOptions.scope).to.equal(scope);
  expect(parsedOptions.chunk).to.not.equal(chunk);

  parsedOptions = parseOptions({scope});

  expect(parsedOptions.scope).to.equal(scope);
  expect(parsedOptions.chunk).to.not.equal(chunk);
  expect(parsedOptions.delay).to.not.equal(delay);
  });
  
  it('should ignore unknown options', () => {
    let chunk = 50;
    let delay = 100;
    let scope = {};
    let ignoredOption = '';
    
    let passedOptions = {chunk, delay, scope, ignoredOption};
    let parsedOptions = parseOptions(passedOptions);

    expect(parsedOptions).to.deep.equal({
      chunk,
      delay,
      scope
    });
  });
  
  it('should throw when an option override has the wrong type', () => {
    let chunk = function() {};
    let delay = [];
    let scope = false;

    expect(() => { parseOptions({chunk}) }).throws(TypeError, /'chunk' should be a positive number/);
    expect(() => { parseOptions({delay}) }).throws(TypeError, /'delay' should be a non-negative number/);
    expect(() => { parseOptions({scope}) }).throws(TypeError, /'scope' should not be undefined, a boolean, or a number/);
  });

  
});



// test('should throw when an option override has the wrong value', t => {
//   let chunk = function() {};
//   let delay = [];

//   t.throws(() => {
//     parseOptions({chunk})
//   }, /'chunk' should be a positive number/);
//   t.throws(() => {
//     parseOptions({delay})
//   }, /'delay' should be a non-negative number/);
//   t.end()
// });

// test('should be immutable', t => {
//   let chunk = 50;
//   let delay = 100;
//   let scope = {};

//   let options = parseOptions({chunk, delay, scope});

//   t.throws(() => {
//     options.delay = 0
//   }, /Cannot assign to read only property 'delay'/);
//   t.throws(() => {
//     options.chunk = 1
//   }, /Cannot assign to read only property 'chunk'/);
//   t.throws(() => {
//     options.scope = this
//   }, /Cannot assign to read only property 'scope'/);
  
//   t.throws(() => {
//     delete options.delay;
//   }, /Cannot delete property 'delay'/);
//   t.throws(() => {
//     delete options.chunk;
//   }, /Cannot delete property 'chunk'/);
//   t.throws(() => {
//     delete options.scope; 
//   }, /Cannot delete property 'scope'/);

//   t.ok(options.delay);
//   t.ok(options.chunk);
//   t.ok(options.scope);

//   t.end()
// });





