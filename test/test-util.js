const { expect } = require('chai');
const util = require('../lib/util');

describe('util', () => {
  describe('#isTypeofString', () => {
    const validValues = [
      'boolean',
      'function',
      'number',
      'object',
      'string',
      'symbol',
      'undefined'];
    validValues.forEach((testValue) => {
      it(`returns true when input is ${JSON.stringify(testValue)}`, () => {
        expect(util.isTypeofString(testValue)).to.equal(true);
      });
    });

    const invalidValues = [
      42,
      'foo',
      'fucntion',
      // eslint-disable-next-line no-new-wrappers
      new String('string'),
      [],
      null,
      false,
      {},
      undefined];
    invalidValues.forEach((testValue) => {
      it(`returns false when input is ${JSON.stringify(testValue)}`, () => {
        expect(util.isTypeofString(testValue)).to.equal(false);
      });
    });
  });

  describe('#isString', () => {
    const validValues = [
      '42',
      'foo',
      // eslint-disable-next-line no-new-wrappers
      new String('foo'),
    ];
    validValues.forEach((testValue) => {
      it(`returns true when input is ${JSON.stringify(testValue)}`, () => {
        expect(util.isString(testValue)).to.equal(true);
      });
    });

    const invalidValues = [
      42,
      [],
      null,
      false,
      {},
      undefined];
    invalidValues.forEach((testValue) => {
      it(`returns false when input is ${JSON.stringify(testValue)}`, () => {
        expect(util.isString(testValue)).to.equal(false);
      });
    });
  });

  describe('#isUndefined', () => {
    let foo;

    const validValues = [
      undefined,
      // eslint-disable-next-line no-undef
      foo,
      {}.foo,
      { foo: undefined }.foo,
    ];
    validValues.forEach((testValue) => {
      it(`returns true when input is ${JSON.stringify(testValue)}`, () => {
        expect(util.isUndefined(testValue)).to.equal(true);
      });
    });

    const invalidValues = [
      42,
      [],
      null,
      false,
      {},
      { foo: true }.foo,
    ];
    invalidValues.forEach((testValue) => {
      it(`returns false when input is ${JSON.stringify(testValue)}`, () => {
        expect(util.isUndefined(testValue)).to.equal(false);
      });
    });
  });

  describe('#isClass', () => {
    // ES5 class
    function Es5() { this.name = 'ES5'; }

    // ES6+ class
    class Es6 { constructor() { this.name = 'ES6'; } }

    const validValues = [
      Es5,
      Es6,
      Array,
      String,
      Number,
      Boolean,
    ];
    validValues.forEach((testValue) => {
      it(`returns true when input is ${testValue}`, () => {
        expect(util.isClass(testValue)).to.equal(true);
      });
    });

    const invalidValues = [
      42,
      [],
      null,
      false,
      {},
      new Es5(),
      new Es6(),
      Array.from([]),
      module,
    ];
    invalidValues.forEach((testValue) => {
      it(`returns false when input is ${testValue !== module ? JSON.stringify(testValue) : testValue}`, () => {
        expect(util.isClass(testValue)).to.equal(false);
      });
    });
  });

  describe('#trimLen', () => {
    const growString = (string, size) => {
      let newVal = '';
      while (newVal.length + string.length < size) {
        newVal += string;
      }

      return newVal;
    };
    it('truncates a string longer than MAX_STRING to MAX_STRING', () => {
      const testValue = growString('Xx', util.MAX_STRING * 2);
      const trimmedValue = util.trimLen(testValue);
      expect(trimmedValue.length).to.be.at.most(util.MAX_STRING);
    });

    it('appends an elipsis (...) to a string longer than MAX_STRING without exceeding MAX_STRING', () => {
      const testValue = growString('Xx', util.MAX_STRING * 2);
      const trimmedValue = util.trimLen(testValue);
      expect(trimmedValue.endsWith('...')).to.equal(true);
    });

    it('does not modify a string shorter than MAX_STRING', () => {
      const testValue = growString('Xx', util.MAX_STRING / 2);
      const trimmedValue = util.trimLen(testValue);
      expect(trimmedValue).to.equal(testValue);
    });

    it('does not modify a string exactly equal to MAX_STRING', () => {
      const testValue = growString('Xx', util.MAX_STRING);
      const trimmedValue = util.trimLen(testValue);
      expect(trimmedValue).to.equal(testValue);
    });

    it('throws on invalid parameter', () => {
      expect(() => util.trimLen(null)).to.throw();
      expect(() => util.trimLen(false)).to.throw();
      expect(() => util.trimLen({})).to.throw();
    });
  });
});
