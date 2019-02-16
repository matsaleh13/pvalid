const { expect } = require('chai');
const {
  PvTypeError, PvValueError, PvRequiredError,
} = require('../lib/error');
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

    it('throws PvTypeError when name is not a string', () => {
      expect(() => validateTypeOrInstance({}, 42, 'number')).to.throw(PvTypeError);
    });

    it('throws PvRequiredError when typeInfo not provided', () => {
      expect(() => validateTypeOrInstance('foo', 42)).to.throw(PvRequiredError);
    });

    it('throws PvValueError when typeInfo not a valid typeof string', () => {
      expect(() => validateTypeOrInstance('foo', 42, 'bar')).to.throw(PvValueError);
    });

    describe('#typeof', () => {
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
        const value = testValues[0];
        const typeStr = testValues[1];

        it(`returns PvTypeError when typeof ${value !== module ? JSON.stringify(value) : value} is not '${typeStr}'`, () => {
          const result = validateTypeOrInstance('foo', value, typeStr);
          expect(result).to.be.an.instanceof(PvTypeError);
          expect(result.message).to.contain('Invalid argument for foo');
        });
      });
    });

    describe('#instanceof', () => {
      // ES5 class
      function Es5() { this.name = 'ES5'; }

      // ES6+ class
      class Es6 { constructor() { this.name = 'ES6'; } }

      const validValues = [
        [new Es5(), Es5],
        [new Es6(), Es6],
        [[], Array],
        [{}.toString, 'function'],
        // eslint-disable-next-line no-new-wrappers
        [new String('bar'), String],
        // eslint-disable-next-line no-new-wrappers
        [new Number(42), Number],
        // eslint-disable-next-line no-new-wrappers
        [new Boolean(true), Boolean],
        [new Date(), Date],
        // eslint-disable-next-line no-new-wrappers
        [new Error('xyzzy'), Error],
        [() => { }, Function],
      ];
      validValues.forEach((testValues) => {
        const value = testValues[0];
        const classOrCtor = testValues[1];

        it(`returns null when value ${JSON.stringify(value)} is instanceof '${classOrCtor}'`, () => {
          const result = validateTypeOrInstance('foo', value, classOrCtor);
          expect(result).to.equal(null);
        });
      });

      const invalidValues = [
        [Es5, Es5],
        [Es6, Es6],
        [{}, Array],
        [{}.toString, String],
        ['bar', String],
        [42, Number],
        [true, Boolean],
        [Date.now(), Date],
        [Error, Error],
      ];
      invalidValues.forEach((testValues) => {
        const value = testValues[0];
        const classOrCtor = testValues[1];

        it(`returns PvTypeError when value ${JSON.stringify(value)} is NOT instanceof '${classOrCtor}'`, () => {
          const result = validateTypeOrInstance('foo', value, classOrCtor);
          expect(result).to.be.an.instanceof(PvTypeError);
          expect(result.message).to.contain('Invalid argument for foo');
        });
      });
    });
  });
});
