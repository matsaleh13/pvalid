const { expect } = require('chai');
const { PvError } = require('../lib/error');
const { validateTypeOrInstance } = require('../lib/pvalid');

describe('pvalid', () => {
  describe('#validateTypeOrInstance', () => {
    it('returns null when null value provided', () => {
      const result = validateTypeOrInstance('foo', null, 'string');
      expect(result).to.equal(null);
    });

    it('returns null when undefined value provided', () => {
      let foo;
      const result = validateTypeOrInstance('foo', foo, 'string');
      expect(result).to.equal(null);
    });

    const validValues = [
      [true, 'boolean'],
      [false, 'boolean'],
      [() => { }, 'function'],
      [{}.toString, 'function'],
      [42, 'number'],
      [0, 'number'],
      [-1, 'number'],
      [module, 'object'],
      [{}, 'object'],
      // eslint-disable-next-line no-new-wrappers
      [new String(), 'object'],
      [Symbol('foo'), 'symbol'],
    ];
    validValues.forEach((testValues) => {
      const value = testValues[0];
      const typeStr = testValues[1];
      it(`returns null when typeof ${value !== module ? JSON.stringify(value) : value} is '${typeStr}'`, () => {
        const result = validateTypeOrInstance('foo', value, typeStr);
        expect(result).to.equal(null);
      });
    });

    const invalidValues = [
      [1, 'boolean'],
      ['false', 'boolean'],
      [{}, 'function'],
      // eslint-disable-next-line no-new-wrappers
      [new Number(42), 'number'],
      ['42', 'number'],
      [false, 'number'],
      // eslint-disable-next-line no-new-wrappers
      [String('foo'), 'object'],
      // eslint-disable-next-line no-new-symbol
      [Symbol, 'symbol'],
      ['foo', 'symbol'],
      ['undefined', 'undefined'],
    ];
    invalidValues.forEach((testValues) => {
      console.log(testValues);
      const value = testValues[0];
      const typeStr = testValues[1];

      it(`returns PvError when typeof ${value !== module ? JSON.stringify(value) : value} is not '${typeStr}'`, () => {
        const result = validateTypeOrInstance('foo', value, typeStr);
        expect(result).to.be.an.instanceof(PvError);
      });
    });

    it('returns null when value instanceof meets expectation', () => {

    });

    it('returns PvError when value instanceof does not meet expectation', () => {

    });

    it('throws when invalid input', () => {

    });
  });
});
