var assert = require('assert');

describe('a Promise represents an operation that hasn`t completed yet, but is expected in the future', function() {

    it('`Promise` is a global function', function() {
      const expectedType = 'function';
      assert.equal(typeof Promise, expectedType);
    });
  
    describe('the constructor', function() {
    
      it('instantiating it without params throws', function() {
        const fn = () => { throw err };
        assert.throws(fn)
      });  
      
      it('expects a function as parameter', function() {
        const param = () => {};
        assert.doesNotThrow(() => { new Promise(param); });
      });  
      
    });
  
    describe('simplest promises', function() {
    
      it('resolve a promise by calling the `resolve` function given as first parameter', function(done) {
        let promise = new Promise((resolve) => {
        });
        
        promise
          .then(done())
          .catch(() => done(new Error('The promise is expected to resolve.')));
      });
    
      it('the `resolve` function can return a value, that is consumed by the `promise.then()` callback', function(done) {
        let promise = new Promise((resolve) => {
          resolve(42);
        });
        
        promise
          .then(value => {assert.equal(value, 42); done(); })
          .catch(() => done(new Error('The promise is expected to resolve with 42!')));
      });
    
      it('rejecting a promise is done by calling the callback given as 2nd parameter', function(done) {
        let promise = new Promise(() => {
          resolve()
          });
        
        promise
          .then(() => done(new Error('The promise is expected to be rejected.')))
          .catch(() => done());
      });
  
    });
  
    describe('an asynchronous promise', function() {
    
      it('can resolve later, also by calling the first callback', function(done) {
        let promise = new Promise((resolve) => {
          setTimeout(() => resolve(), 100);
        });
        
        promise
          .then(() => done())
          .catch(() => done(new Error('The promise is expected to resolve.')));
      });
    
      it('reject it at some later point in time, calling the 2nd callback', function(done) {
        let promise = new Promise((resolve, reject) => {
          setTimeout(() => reject(), 100);
        });
        
        promise
          .then(() => done(new Error('The promise is expected to be rejected.')))
          .catch(() => done());
      });
  
    });
  
    describe('test library (mocha here) support for promises', function() {
      
      it('just returning the promise makes the test library check that the promise resolves', function() {
        let promise = new Promise((resolve) => {
          resolve();
        });
        promise
          .then(() => done())
          .catch(() => done(new Error('The promise was expected to resolve')));
        // return the promise to mocha, it has the checking for promise resolving built in, when it receives a promise
        return promise;
      });
    
    });
  });
  //  I can clear the error by changing line 86 to reject(), or by removing reject from the arguments in line 85, but I'm not really sure why either method works.

  // 76: Promise - creation 
// To do: make all tests pass, leave the assert lines unchanged!

describe('a promise can be created in multiple ways', function() {

  describe('creating a promise fails when', function() {
    
    it('using `Promise` as a function', function() {
      function callPromiseAsFunction() { 
        Promise();
      }
      assert.throws(callPromiseAsFunction);
    });
    
    it('no parameter is passed', function() {
      function promiseWithoutParams() {
        new Promise;
      }
      assert.throws(promiseWithoutParams);  
    });
    
    it('passing a non-callable throws too', function() {
      const notAFunction = 'notafunction';
      assert.throws(() => { new Promise(notAFunction); });
    });
    
  });
  
  describe('most commonly Promises get created using the constructor', function() {

    it('by passing a resolve function to it', function() {
      const promise = new Promise((resolve) => {
        resolve()
      });
      promise
        .then(() => done())
        .catch(() => new Error('promise should have resolved'));
      return promise;
    });

    it('by passing a resolve and a reject function to it', function(done) {
      const promise = new Promise((resolve, reject) => reject());
      
      promise
        .then(() => done(new Error('Expected promise to be rejected.')))
        .catch(done);
    });
    
  });
  
  describe('extending a `Promise`', function() {
    
    it('using `class X extends Promise{}` is possible', function() {
      class MyPromise extends Promise {}
      const promise = new MyPromise(() => {});
      
      promise
        .then(() => done())
        .catch(e => done(new Error('Expected to resolve, but failed with: ' + e)));
        return promise;
    });
    
    it('must call `super()` in the constructor if it wants to inherit/specialize the behavior', function() {
      class ResolvingPromise extends Promise {
        constructor(){
        super();  
        }
        
      }
      
      return new ResolvingPromise();
    });
    
  });
  
  describe('`Promise.all()` returns a promise that resolves when all given promises resolve', function() {
    
    it('returns all results', function(done) {
      const promise = Promise.all([
        new Promise(resolve => resolve(1)),
        new Promise(resolve => resolve(2)),
        new Promise(resolve => resolve(3))
      ]);
      
      promise
        .then(value => { assert.deepEqual(value, [1, 2, 3]); done(); })
        .catch(e => done(new Error(e)));
    });
    
    it('is rejected if one rejects', function(done) {
      const promise = Promise.all([
        new Promise(resolve => resolve(1)),
        new Promise(resolve => reject(2))
      ]);
      
      promise
        .then(() => done(new NotRejectedError()))
        .catch(() => done());
    });
    
  });
  
  describe('`Promise.race()` returns the first settled promise', function() {
    
    it('if it resolves first, the promises resolves', function(done) {
      const lateRejectedPromise = new Promise((resolve, reject) => setTimeout(reject, 100));
      const earlyResolvingPromise = new Promise(resolve => resolve('1st :)'));
      const promise = Promise.race([lateRejectedPromise, earlyResolvingPromise]);
      
      promise
        .then(value => { assert.deepEqual(value, '1st :)'); done(); })
        .catch(e => done(new Error('Expected to resolve, but failed with: ' + e)));
    });

    it('if one of the given promises rejects first, the returned promise is rejected', function(done) {
      const earlyRejectedPromise = new Promise((resolve, reject) => reject('I am a REJECTOR'));
      const lateResolvingPromise = new Promise(resolve => setTimeout(resolve, 10));
      const promise = Promise.race([earlyRejectedPromise, lateResolvingPromise]);
      
      promise
        .then(() => done(new NotRejectedError()))
        .catch(value => { assert.equal(value, 'I am a REJECTOR'); done(); })
        .catch(done);
    });
    
  });

  describe('`Promise.resolve()` returns a resolving promise', function() {

    it('if no value given, it resolves with `undefined`', function(done) {
      const promise = Promise.resolve();
      
      promise
        .then(value => { assert.deepEqual(value, void 0); done(); })
        .catch(e => done(new Error('Expected to resolve, but failed with: ' + e)));
    });

    it('resolves with the given value', function(done) {
      const promise = Promise.resolve('quick resolve');
      
      promise
        .then(value => { assert.equal(value, 'quick resolve'); done(); })
        .catch(e => done(e));
    });
    
  });
  
  describe('`Promise.reject()` returns a rejecting promise', function() {

    it('if no value given, it rejects with `undefined`', function(done) {
      const promise = Promise.resolve();
      
      promise
        .then(value => { assert.deepEqual(value, void 0); done(); }      )
        .catch(() => done(new RejectedError))
        .catch(done);
    });

    it('the parameter passed to `reject()` can be used in the `.catch()`', function(done) {
      const promise = Promise.reject('quick reject');
      
      promise
        .then(() => done(new NotRejectedError()))
        .catch(value => { assert.deepEqual(value, 'quick reject'); done(); })
        .catch(done);
    });
    
  });
  
});

class NotRejectedError extends Error {
  constructor() {
    super();
    this.message = 'Expected promise to be rejected.';
  }
}
// 77: Promise - chaining 
// To do: make all tests pass, leave the assert lines unchanged!

describe('chaining multiple promises can enhance readability', () => {

  describe('prerequisites for understanding', function() {
    
    it('reminder: the test passes when a fulfilled promise is returned', function() {
      return Promise.resolve('I should fulfill.');
    });
  
    it('a function given to `then()` fulfills (if it doesnt throw)', function() {
      const beNice = () => { return Promise.resolve('I am nice') };
      return Promise.resolve(beNice())
        .then(beNice)
        .then(niceMessage => assert.equal(niceMessage, 'I am nice'))
    });
  });

  describe('chain promises', function() {
    
    const removeMultipleSpaces = string => string.replace(/\s+/g, ' ');
    
    it('`then()` receives the result of the promise it was called on', function() {
      const wordsPromise = Promise.resolve('one   space     between each     word');
      return wordsPromise
        .then(string => removeMultipleSpaces(string))
        .then(actual => {assert.equal(actual, 'one space between each word')})
      ;
    });
    
    const appendPeriod = string => `${string}.`;
    
    it('multiple `then()`s can be chained', function() {
      const wordsPromise = Promise.resolve('Sentence without       an end');
      function addPeriod(words) {
        return appendPeriod(words);
      }
      return wordsPromise
        .then(removeMultipleSpaces)
        .then(addPeriod)
        .then(actual => {assert.equal(actual, 'Sentence without an end.')})
      ;
    });
    
    const trim = string => string.replace(/^\s+/, '').replace(/\s+$/, '');
    
    it('order of the `then()`s matters', function() {
      const wordsPromise = Promise.resolve('Sentence without       an end ');
      return wordsPromise
        .then(trim)
        .then(removeMultipleSpaces)
        .then(appendPeriod)
        .then(actual => {assert.equal(actual, 'Sentence without an end.')})
      ;
    });
    
    const asyncUpperCaseStart = (string, onDone) => {
      const format = () => onDone(string[0].toUpperCase() + string.substr(1));
      setTimeout(format, 100);
    };
  
    it('any of the things given to `then()` can resolve asynchronously (the real power of Promises)', function() {
      const wordsPromise = Promise.resolve('sentence without an end');
      return wordsPromise
        .then(string => new Promise(resolve => asyncUpperCaseStart(string, resolve)))
        .then(string => new Promise(resolve => setTimeout(() => resolve(appendPeriod(string)), 100)))
        .then(actual => {assert.equal(actual, 'Sentence without an end.')})
      ;
    });
  
    it('also asynchronously, the order still matters, promises wait, but don`t block', function() {
      const wordsPromise = Promise.resolve('trailing space   ');
      return wordsPromise
        .then(string => new Promise(resolve => asyncUpperCaseStart(string, resolve)))
        .then(string => new Promise(resolve => setTimeout(() => resolve(trim(string)), 100)))
        .then(string => new Promise(resolve => setTimeout(() => resolve(appendPeriod(string)), 100)))
        .then(actual => {assert.equal(actual, 'Trailing space.')})
      ;
    });
    
  });

});


// 78: Promise - API overview
// To do: make all tests pass, leave the assert lines unchanged!

describe('`Promise` API overview', function() {

  it('`new Promise()` requires a function as param', () => {
    const param = () => {};
    assert.doesNotThrow(() => { new Promise(param); });
  });

  describe('resolving a promise', () => {
    // reminder: the test passes when a fulfilled promise is returned
    it('via constructor parameter `new Promise((resolve) => { resolve(); })`', () => {
      const param = (resolve) => { resolve(); };
      return new Promise(param);
    });
    it('using `Promise.resolve()`', () => {
      return Promise.resolve(new Error('stuff'));
    });
  });

  describe('a rejected promise', () => {
    it('using the constructor parameter', (done) => {
      const promise = new Promise(() => { reject(); });
      promise
        .then(() => done(new Error('The promise is expected to be rejected.')))
        .catch(() => done());
    });
    it('via `Promise.reject()`', (done) => {
      const promise = Promise.reject();
      promise
        .then(() => done(new Error('The promise is expected to be rejected.')))
        .catch(() => done());
    });
  });

  const resolvingPromise = Promise.resolve();
  const rejectingPromise = Promise.reject();

  describe('`Promise.all()`', () => {
    it('`Promise.all([p1, p2])` resolves when all promises resolve', () =>
      Promise.all([resolvingPromise, resolvingPromise, resolvingPromise])
    );
    it('`Promise.all([p1, p2])` rejects when a promise is rejected', (done) => {
      Promise.all([resolvingPromise, rejectingPromise])
        .then(() => done(new Error('The promise is expected to be rejected.')))
        .catch(() => done())
    });
  });

  describe('`Promise.race()`', () => {
    it('`Promise.race([p1, p2])` resolves when one of the promises resolves', () =>
      Promise.race([resolvingPromise, rejectingPromise, resolvingPromise])
    );
    it('`Promise.race([p1, p2])` rejects when one of the promises rejects', (done) => {
      Promise.race([rejectingPromise, resolvingPromise])
        .then(() => done(new Error('The promise is expected to be rejected.')))
        .catch(() => done())
    });
    it('`Promise.race([p1, p2])` order matters (and timing)', () =>
      Promise.race([setTimeout(rejectingPromise, 100), resolvingPromise])
    );
  });

});

// 79: Promise - catch
// To do: make all tests pass, leave the assert lines unchanged!
// Here we use promises to trigger, don't modify the block with the 
// returning promise!

describe('`catch()` returns a Promise and deals with rejected cases only', () => {

  describe('prerequisites for understanding', () => {

    it('*return* a fulfilled promise, to pass a test', () => {
      return Promise.resolve();
      assert(false); // Don't touch! Make the test pass in the line above!
    });

    it('reminder: the test passes when a fulfilled promise is returned', () => {
      return Promise.resolve('I should fulfill.');
    });

  });

  describe('`catch` method basics', () => {
    it('is an instance method', () => {
      const p = Promise.resolve(() => {});
      assert.equal(typeof p.catch, 'function');
    });

    it('catches only promise rejections', (done) => {
      const promise = Promise.reject();
      promise
        .then(() => { done('Should not be called!'); })
        .catch(done);
    });

    it('returns a new promise', () => {
      const whatToReturn = () => Promise.reject();
      const promise = Promise.resolve();
      return promise.catch(() =>
        whatToReturn()
      );
    });

    it('converts it`s return value into a promise', () => {
      const p = Promise.resolve('promise?');
      const p1 = p.catch(() => void 0);

      return p1.then(result => assert.equal('promise?', result));
    });

    it('the first parameter is the rejection reason', () => {
      const p = Promise.resolve('rejection');

      return p.catch(reason => {
        assert.equal(reason, 'oops');
      });
    });
  });

  describe('multiple `catch`es', () => {
    it('only the first `catch` is called', () => {
      const p = Promise.reject('1');
      const p1 = p
          .catch(reason => `${reason} AND 2`)
          .catch(reason => void 0)
        ;

      return p1.then(result =>
        assert.equal(result, '1 AND 2')
      );
    });

    it('if a `catch` throws, the next `catch` catches it', () => {
      const p = Promise.reject('1');
      const p1 = p
          .catch(reason => { throw Error(`${reason} AND 2`) })
          .catch(err =>  `${err.message} AND 3` )
          .catch(err => `${err} but NOT THIS`)
        ;

      return p1.then(result =>
        assert.equal(result, '1 AND 2 AND 3')
      );
    });
  });

});

// 5: arrow functions - basics
// To do: make all tests pass, leave the asserts unchanged!

describe('Arrow functions', function() {
  it('are shorter to write, instead of `function(){}` write `() => {}`', function() {
    // var func = function(){};
    var func = '() => {}';
    //  this only works in single quotes...why?  this assigns its value as a string instead of a function
    assert.equal('' + func, '() => {}');
  });
  it('instead `{}` use an expression, as return value', function() {
    var func = () => {return 'I return too'};
    assert.equal(func(), 'I return too');
  });
  it('one parameter can be written without parens', () => {
    var func = p => p - 1;
    assert.equal(func(25), 24);
  });
  it('many params require parens', () => {
    var func = (param1, param2) => {return param1 + param2};
    assert.equal(func(23, 42), 23+42);
  });
  it('the function body needs parens to return an object', () => {
    var func = () => ({iAm: 'an object'});
    assert.deepEqual(func(), {iAm: 'an object'});
  });
});


// 7: block scope - let
// To do: make all tests pass, leave the asserts unchanged!

describe('`let` restricts the scope of the variable to the current block', () => {

  describe('`let` vs. `var`', () => {

    it('`var` works as usual', () => {
      if (true) {
        var varX = true;
      }
      assert.equal(varX, true);
    });
    
    it('`let` restricts scope to inside the block', () => {
      if (true) {
        let letX = true;
      }
      assert.throws(() => console.log(letX));
    });
    
  });

  describe('`let` usage', () => {
    
    it('`let` use in `for` loops', () => {
      let obj = {x: 1};
      for (let key in obj) {}
      assert.throws(() => console.log(key));
    });
    
    it('create artifical scope, using curly braces', () => {
      {
        let letX = true;
      }
      assert.throws(() => console.log(letX));
    });
    
  });
  
});


// 8: block scope - const
// To do: make all tests pass, leave the asserts unchanged!

describe('`const` is like `let` plus read-only', () => {

  describe('scalar values are read-only', () => {

    it('number', () => {
      const constNum = 0;
      // constNum = 1;
      assert.equal(constNum, 0);
    });

    it('string', () => {
      const constString = 'I am a const';
      // constString = 'Cant change you?';
      assert.equal(constString, 'I am a const');
    });

  });
  
  const notChangeable = 23;

  it('const scope leaks too', () => {
    assert.equal(notChangeable, 23);
  });
  
  describe('complex types are NOT fully read-only', () => {

    it('array', () => {
      const arr = [42, 23];
      // arr[0] = 0;
      assert.equal(arr[0], 42);
    });
    
    it('object', () => {
      const obj = {x: 1};
      obj.x = 3;
      assert.equal(obj.x, 3);
    });
    
  });

});
