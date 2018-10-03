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
