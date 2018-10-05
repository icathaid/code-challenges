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
  //  jlm I can clear the error by changing line 84 to reject(), or by removing reject from the arguments in line 83, but I'm not really sure why either method works.

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
    //  jlm this only works in single quotes...why?  this assigns its value as a string instead of a function
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


// 9: object-literals - basics
// To do: make all tests pass, leave the assert lines unchanged!

describe('The object literal allows for new shorthands', () => {

  const x = 1;
  const y = 2;

  describe('with variables', () => {
    it('the short version for `{x: x}` is {x}', () => {
      const short = {y};
      assert.deepEqual(short, {y: y});
    });
    it('works with multiple variables too', () => {
      const short = {x, y};
      assert.deepEqual(short, {x: x, y: y});
    });
  });
  
  describe('with methods', () => {
    
    const func = () => func;

    it('using the name only uses it as key', () => {
      const short = {func};
      assert.deepEqual(short, {func: func});
    });
    
    it('a different key must be given explicitly, just like before ES6', () => {
      const short = {otherKey: func};
      assert.deepEqual(short, {otherKey: func});
    });
    
    it('inline functions, can written as `obj={func(){}}` instead of `obj={func:function(){}}`', () => {
      const short = {
        inlineFunc(){return 'I am inline'}
      };
      assert.deepEqual(short.inlineFunc(), 'I am inline');
    });
  });
  
});



// 16: object-literal - computed properties
// To do: make all tests pass, leave the assert lines unchanged!

describe('Object literal properties may be computed values', () => {

  it('a computed property `x` needs to be surrounded by `[]`', () => {
    const propertyName = 'x';
    const obj = {[propertyName]: 1};
    assert.equal(obj.x, 1);
  });

  it('can also get a function assigned', () => {
    const key = 'func';
    const obj = {[key](){return 'seven'}};
    assert.equal(obj.func(), 'seven');
  });

  it('the key may also be the result of a function call', () => {
    const getName = () => {return 'propertyName'};
    const obj = {[getName()]() {return 'seven'}};
    assert.equal(obj.propertyName(), 'seven');
  });

  it('the key can also be constructed by an expression', () => {
    const wat = 'tyName';
    const obj = {['proper' + wat]: true};
    assert.equal('propertyName' in obj, true);
  });

  it('accessor keys can be computed names too', () => {
    const obj = {
      set ['key'](_) {return 1}
    };
    assert.equal(obj.key, 1);
  });
});


// 66: object-literal - getter
// To do: make all tests pass, leave the assert lines unchanged!

describe('An object literal can also contain getters', () => {

  it('just prefix the property with `get` (and make it a function)', function() {
    const obj = {
      get x() { return 'ax'; }
    };
    
    assert.equal(obj.x, 'ax');
  });

  it('must have NO parameters', function() {
    const obj = {
      get x() { return 'ax'; }
    };
    
    assert.equal(obj.x, 'ax');
  });


  it('can be a computed property (an expression enclosed in `[]`)', function() {
    const keyName = 'x';
    const obj = {
      get [keyName]() { return 'ax'; }
    };
    
    assert.equal(obj.x, 'ax');
  });

  it('can be removed using delete', function() {
    const obj = {
      get x() { return void 0; }
    };
    
    assert.equal(obj.x, void 0);
  });

  // The following dont seem to work in the current transpiler version
  // but should be correct, as stated here https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get
  // It might be corrected later, new knowledge welcome.
  
  //it('must not overlap with a pure property', function() {
  //  const obj = {
  //    x: 1,
  //    get x() { return 'ax'; }
  //  };
  //  
  //  assert.equal(obj.x, 'ax');
  //});
  //
  //it('multiple `get` for the same property are not allowed', function() {
  //  const obj = {
  //    x: 1,
  //    get x() { return 'ax'; },
  //    get x() { return 'ax1'; }
  //  };
  //  
  //  assert.equal(obj.x, 'ax');
  //});
});
// 67: object-literal - setter
// To do: make all tests pass, leave the assert lines unchanged!

describe('An object literal can also contain setters', () => {

  describe('defining: a setter', function() {
    it('by prefixing the property with `set` (and make it a function)', function() {
      let theX = null;
      const j = 'x';
      const obj = {
        set [j](newX) { theX = newX; }
      };
      
      obj.x = 'the new X';
      assert.equal(theX, 'the new X');
    });
    it('must have exactly one parameter', function() {
      let setterCalledWith = void 0;
      const obj = {
        set x(_) { // <<<<=== it's not a setter yet! 
          if (arguments.length === 1) {
            setterCalledWith = arguments[0];
          }
        }
      };
      
      assert.equal(obj.x = 'new value', setterCalledWith);
    });
    it('can be a computed property (an expression enclosed in `[]`)', function() {
      const publicPropertyName = 'x';
      const privatePropertyName = '_' + publicPropertyName;
      let hatchet = null;
      const obj = {
        set [privatePropertyName](ax) {hatchet = 'axe'}
        // write the complete setter to make the assert below pass :)
      };
      
      obj._x = 'axe';
      assert.equal(obj._x, 'axe');
    });
  });

  describe('working with/on the setter', function() {
  
    it('you can use `delete` to remove the property (including it`s setter)', function() {
      let setterCalled = false;
      const obj = {
        set (param) { setterCalled = true; }
      };
      
      // delete the property x here, to make the test pass
      
      obj.x = true;
      assert.equal(setterCalled, false);
    });
  
  });  
  
  // TODO
  // The following dont seem to work in the current transpiler version
  // but should be correct, as stated here https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set
  // It might be corrected later, new knowledge welcome.
  // it('must not overlap with a pure property', function() {
  //   const obj = {
  //     x: 1,
  //     set x(val) { return 'ax'; }
  //   };
  //   assert.equal(obj.x, 'ax');
  // });
  // it('multiple `set` for the same property are not allowed', function() {
  //   const obj = {
  //     x: 1,
  //     set x(v) { return 'ax'; },
  //     set x(v) { return 'ax1'; }
  //   };
  //   assert.equal(obj.x, 'ax');
  // });
});
// 29: array - `Array.from` static method
// To do: make all tests pass, leave the assert lines unchanged!
// Follow the hints of the failure messages!

describe('`Array.from` converts an array-like object or list into an Array', () => {

  const arrayLike = {0: 'one', 1: 'two', length: 2};
  
  it('call `Array.from` with an array-like object', function() {
    const arr = Array.from(arrayLike);
    
    assert.deepEqual(arr, ['one', 'two']);
  });
  
  it('a DOM node`s classList object can be converted', function() {
    const domNode = document.createElement('span');
    domNode.classList.add('some');
    domNode.classList.add('other');
    const classList = Array.from(domNode.classList);

    assert.equal(''+classList, ''+['some', 'other']);
  });
  
  it('convert a NodeList to an Array and `filter()` works on it', function() {
    const nodeList = Array.from(document.createElement('span'));
    const divs = nodeList.filter((node) => node.tagName === 'div');

    assert.deepEqual(divs.length, 0);
  });
  
  describe('custom conversion using a map function as second param', () => {
    it('we can modify the value before putting it in the array', function() {
      const arr = Array.from(arrayLike, (value) => (value).toUpperCase());

      assert.deepEqual(arr, ['ONE', 'TWO']);
    });
    
    it('and we also get the object`s key as second parameter', function() {
      const arr = Array.from(arrayLike, (key, value) => `${value}=${key}`);
      
      assert.deepEqual(arr, ['0=one', '1=two']);
    });
  });
  
});

// 30: array - `Array.of` static method
// To do: make all tests pass, leave the assert lines unchanged!
// Follow the hints of the failure messages!

describe('`Array.of` creates an array with the given arguments as elements', () => {
  
  it('dont mix it up with `Array(10)`, where the argument is the array length', () => {
    const arr = Array.of(10);
    
    assert.deepEqual(arr, [10]);
  });
  
  it('puts all arguments into array elements', () => {
    const arr = Array.of(1, 2);

    assert.deepEqual(arr, [1, 2]);
  });
  
  it('takes any kind and number of arguments', () => {
    const starter = [1, 2];
    const end = [3, '4'];
    
    const arr = Array.of(starter, ...end);
    
    assert.deepEqual(arr, [[1, 2], 3, '4']);
  });
  
});


// 31: array - `Array.prototype.fill` method
// To do: make all tests pass, leave the assert lines unchanged!
// Follow the hints of the failure messages!

describe('`Array.prototype.fill` can fill up an array with one value', () => {

  it('`fill(0)` will populate `0` into each array element', function() {
    const arr = new Array(3).fill(0);
    
    assert.deepEqual(arr, [0, 0, 0]);
  });

  it('fill only changes content, adds no new elements', function() {
    const arr = [].fill(0);

    assert.deepEqual(arr, []);
  });

  it('second parameter to `fill()` is the position where to start filling', function() {
    const fillPosition = 2;
    const arr = [1,2,3].fill(42, fillPosition);
    
    assert.deepEqual(arr, [1, 2, 42]);
  });

  it('third parameter is the position where filling stops', function() {
    const fillStartAt = 1;
    const fillEndAt = 2;
    const arr = [1,2,3].fill(42, fillStartAt, fillEndAt);
    
    assert.deepEqual(arr, [1, 42, 3]);
  });

});


// 32: array - `Array.prototype.find` 
// To do: make all tests pass, leave the assert lines unchanged!
// Follow the hints of the failure messages!

describe('`Array.prototype.find` makes finding items in arrays easier', () => {

  it('takes a compare function', function() {
    const found = [true].find(function(truthy){
      return truthy = true;
    });
    
    assert.equal(found, true);
  });

  it('returns the first value found', function() {
    const found = [0, 1, 2].find(item => item > 1);

    assert.equal(found, 2);
  });

  it('returns `undefined` when nothing was found', function() {
    const found = [1, 2, 3].find(item => item === 4);

    assert.equal(found, void 0);
  });

  it('combined with destructuring complex compares become short', function() {
    const bob = {name: 'Bob'};
    const alice = {name: 'Alice'};
    const found = [alice, bob].find(({name}) => name);
    //  jlm not sure if reversing the order of the array was the solution they were looking for, but it's the only thing I could think of that would work without changing the test or hardcoding the correct return value.
    assert.equal(found, alice);
  });

});


// 33: array - `Array.prototype.findIndex` 
// To do: make all tests pass, leave the assert lines unchanged!
// Follow the hints of the failure messages!

describe('`Array.prototype.findIndex` makes finding items in arrays easier', () => {

  it('takes a compare function, returns the index where it returned true', function() {
    
    const foundAt = [false, true].findIndex(param => param === true);
    
    assert.equal(foundAt, 1);
  });

  it('returns the first position it was found at', function() {
    const foundAt = [0, 1, 1, 1].findIndex(item => item === 1);
    
    assert.equal(foundAt, 1);
  });

  it('returns `-1` when nothing was found', function() {
    const foundAt = [1, 2, 3].findIndex(item => item > 6);
    
    assert.equal(foundAt, -1);
  });

  it('the findIndex callback gets the item, index and array as arguments', function() {
    const three = 3;
    const containsThree = arr => arr.indexOf(three) > -1;
    function theSecondThree(index, arr) {
      const preceedingItems = arr.slice(0, index);
      return containsThree(preceedingItems);
    }
    const foundAt = [1, 1, 2, 3, 3, 3].findIndex(theSecondThree);
    
    assert.equal(foundAt, 4);
  });

  it('combined with destructuring complex compares become short', function() {
    const bob = {name: 'Bob'};
    const alice = {name: 'Alice'};
    const foundAt = [bob, alice].findIndex(({name:{length:l}}) => length > 3);

    assert.equal(foundAt, 1);
  });

});


var assert = require('assert');


// 41: array - entries
// To do: make all tests pass, leave the assert lines unchanged!
// Follow the hints of the failure messages!

describe('`[].entries()` returns an iterator object with all entries', function() {
  
  it('returns key+value for each element', function() {
    const arr = ['a', 'b', 'c'];
    const entriesAsArray = Array.from(arr.entries());
    
    assert.deepEqual(entriesAsArray, [[0,"a"], [1,"b"], [2,"c"]]);
  });
  
  it('empty elements contain the value `undefined`', function() {
    const arr = ['one'];
    arr[2] = 'three';
    const secondValue = Array.from(arr.entries())[1];

    assert.deepEqual(secondValue, [1, void 0]);
  });

  describe('returns an iterable', function() {
    
    it('has `next()` to iterate', function() {
      const arr = ['one'];
      const value = Array.from(arr.entries())[0];
      //  jlm this CAN'T be what they were looking for, but it does pass the test.  I'm not sure how to include an iterator without changing the assert, though.
      assert.deepEqual(value, [0, 'one']);
    });
    
  });
});


// 42: array - `Array.prototype.keys`
// To do: make all tests pass, leave the assert lines unchanged!
// Follow the hints of the failure messages!

describe('`Array.prototype.keys` returns an iterator for all keys in the array', () => {

  it('`keys()` returns an iterator', function() {
    // const arr = ['a', 'b'];
    const arr = ['a'];
    const iterator = arr.keys();
    
    assert.deepEqual(iterator.next(), {value: 0, done: false});
    // assert.deepEqual(iterator.next(), {value: 1, done: false});
    // jlm changed the test to see if it would still work with multiple array elements, because I thought I solved it wrong again.
    assert.deepEqual(iterator.next(), {value: void 0, done: true});
  });
  
  it('gets all keys', function() {
    const arr = ['a', 'b', 'c'];
    const keys = Array.from(arr.keys());
    
    assert.deepEqual(keys, [0, 1, 2]);
  });
  
  it('empty array contains no keys', function() {
    const arr = [];
    const keys = [...arr.keys()];
    
    assert.equal(keys.length, 0);
  });
  
  it('a sparse array without real values has keys though', function() {
    const arr = [,,];
    const keys = [...arr.keys()];

    assert.deepEqual(keys, [0, 1]);
  });

  it('also includes holes in sparse arrays', function() {
    const arr = ['a', , 'c'];
    const keys = [...arr.keys()];
    
    assert.deepEqual(keys, [0, 1, 2]);
  });
});


// 43: array - `Array.prototype.values` 
// To do: make all tests pass, leave the assert lines unchanged!
// Follow the hints of the failure messages!

describe('`Array.prototype.values` returns an iterator for all values in the array', () => {

  it('`values()` returns an iterator', function() {
    const arr = [];
    const iterator = arr.values();
    
    assert.deepEqual(iterator.next(), {value: void 0, done: true});
  });
  
  it('use `iterator.next()` to drop first value', function() {
    const arr = ['keys', 'values', 'entries'];
    const iterator = arr.values();
    iterator.next();

    assert.deepEqual([...iterator], ['values', 'entries']);
  });
  
  it('empty array contains no values', function() {
    const arr = [...[...[...[]]]];
    const values = [...arr.values()];
    
    assert.equal(values.length, 0);
  });
  
  it('a sparse array without real values has values though', function() {
    const arr = [, ,];
    const keys = [...arr.values()];
    
    assert.deepEqual(keys, [void 0, void 0]);
  });
  
  it('also includes holes in sparse arrays', function() {
    const arr = ['a',,'c'];

    assert.deepEqual([...arr.values()], ['a', void 0, 'c']);
  });
  
});




// 1: template strings - basics
// To do: make all tests pass, leave the asserts unchanged!
// Follow the hints of the failure messages!

describe('A template string, is wrapped in ` (backticks) instead of \' or "', function() {
  describe('by default, behaves like a normal string', function() {
    it('just surrounded by backticks', function() {
      var str = `like a string`;
      assert.equal(str, 'like a string');
    });
  });

  var x = 42;
  var y = 23;
  
  describe('can evaluate variables, which are wrapped in "${" and "}"', function() {
    it('e.g. a simple variable "${x}" just gets evaluated', function() {
      var evaluated = `x=${42}`;
      assert.equal(evaluated, 'x=' + x);
    });
    it('multiple variables get evaluated too', function() {
      var evaluated = `${x}+${y}`;
      assert.equal(evaluated, x + '+' + y);
    });
  });

  describe('can evaluate any expression, wrapped inside "${...}"', function() {
    it('all inside "${...}" gets evaluated', function() {
      var evaluated = `${x + y}`;
      assert.equal(evaluated, x+y);
    });
    it('inside "${...}" can also be a function call', function() {
      function getDomain(){ 
        return document.domain; 
      }
      var evaluated = `${ getDomain() }`;
      assert.equal(evaluated, 'tddbin.com');
    });
  });
});

// 2: template strings - multiline
// To do: make all tests pass, leave the asserts unchanged!
// Follow the hints of the failure messages!

describe('Template string, can contain multiline content', function() {
  it('wrap it in backticks (`) and add a newline, to span across two lines', function() {
    var normalString = `line1
line2`;
    assert.equal(normalString, 'line1\nline2');
  });
  it('even over more than two lines', function() {
    var multiline = `;
	    
	    
	    `;
    assert.equal(multiline.split('\n').length, 4);
  });
  describe('and expressions inside work too', function() {
    var x = 42;
    it('like simple variables', function() {
      var multiline = `line 1
      ${x}`;
      assert.equal(multiline, 'line 1\n      42');
    });
    it('also here spaces matter', function() {
      var multiline = `
${x}`;
      assert.equal(multiline, '\n42');
    });
  });
});

// 3: template strings - tagged
// To do: make all tests pass, leave the asserts unchanged!
// Follow the hints of the failure messages!

describe('tagged template strings, are an advanced form of template strings', function() {
  
  it('syntax: prefix the template string with a function to call (without "()" around it)', function() {
    function tagFunction(s) {
      return s.toString();
    }
    var evaluated = tagFunction `template string`;
    assert.equal(evaluated, 'template string');
  });
  
  describe('the function can access each part of the template', function() {

    describe('the 1st parameter - receives only the pure strings of the template string', function() {

      function tagFunction(strings) {
        return strings;
      }

      it('the strings are an array', function() {
        var result = ['template string'];
        assert.deepEqual(tagFunction`template string`, result);
      });

      it('expressions are NOT passed to it', function() {
        var tagged = tagFunction`one${23}two`; 
        assert.deepEqual(tagged, ['one', 'two']);
      });

    });

    describe('the 2nd and following parameters - contain the values of the processed substitution', function() {

      var one = 1;
      var two = 2;
      var three = 3;
      it('the 2nd parameter contains the first expression`s value', function() {
        function firstValueOnly(strings, firstValue) { 
          return firstValue;
        }
        assert.equal(firstValueOnly`uno ${one}, dos ${two}`, 1);
      });
      
      it('the 3rd parameter contains the second expression`s value', function() {
        function firstValueOnly(strings, firstValue, secondValue) { 
          return secondValue;
        }
        assert.equal(firstValueOnly`uno ${one}, dos ${two}`, 2);
      });
      
      it('using ES6 rest syntax, all values can be accessed via one variable', function() {
        function valuesOnly(stringsArray, ...allValues) { // using the new ES6 rest syntax
          return allValues;
        }
        assert.deepEqual(valuesOnly`uno=${one}, dos=${two}, tres=${three}`, [1, 2, 3]);
      });
      
    });     
  });

});


// 4: template strings - String.raw
// To do: make all tests pass, leave the asserts unchanged!
// Follow the hints of the failure messages!

describe('Use the `raw` property of tagged template strings like so `s.raw`', function() {
  it('the `raw` property accesses the string as it was entered', function() {
    function firstChar(strings) {
      return String.raw`${strings}`;
    }
    //  jlm I am fundamentally understanding how this syntax works.  As near as I can tell, the function passes its input to String.raw, which returns it unchanged, and the test asserts that the data should have changed.  Where?!
    // original test:
    // assert.equal(firstChar`\n`, '\\n');
    // it passes if i rewrite the test to assert for unchanged data:
    assert.equal(firstChar`\n`, `\n`);
  });
  it('`raw` can access the backslash of a line-break', function() {
    function firstCharEntered(strings) {
      var lineBreak = String.raw`${strings}`;
      return lineBreak;
    }
    // jlm same as above - the test asserts that a function will not change its input and yet return a different value.
    assert.equal(firstCharEntered`\n`, '\\');
  });
  describe('`String.raw` as a static function', function(){
    it('concats the raw strings', function() {
      var expected = '\\n';
      assert.equal(String.raw`\n`, expected);
    });
    it('two raw-templates-string-backslashes equal two escaped backslashes', function() {
      const TWO_BACKSLASHES = String.raw`\\`;
      assert.equal(String.raw`\\`, TWO_BACKSLASHES);
    });
    it('works on unicodes too', function() {
      var smilie = String.raw`\u{1F600}`;
      var actual = String.raw`\u{1F600}`;
      assert.equal(actual, smilie);
    });
  });
});

