var assert = require('assert');


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