const { expect } = require('chai');
const { inspect } = require('util');
const { validate } = require('../lib/wrapper');
const { PvError } = require('../lib/error');

const replacer = (key, value) => {
  if (typeof value === 'function') return inspect(value);
  return value;
};

describe('wrapper', () => {
  describe('#validate', () => {
    // ES5 class
    function Es5() { this.name = 'ES5'; }
    // ES6+ class
    class Es6 { constructor() { this.name = 'ES6'; } }

    const validValues = [
      [true, { foo: 'boolean' }],
      [false, { foo: 'boolean' }],
      [() => { }, { foo: 'function' }],
      [{}.toString, { foo: 'function' }],
      [42, { foo: 'number' }],
      [0, { foo: 'number' }],
      [-1, { foo: 'number' }],
      [module, { foo: 'object' }],
      [{}, { foo: 'object' }],
      // eslint-disable-next-line no-new-wrappers
      [new String(), { foo: 'object' }],
      [Symbol('foo'), { foo: 'symbol' }],
      [new Es5(), { foo: Es5 }],
      [new Es6(), { foo: Es6 }],
      [[], { foo: Array }],
      [{}.toString, { foo: 'function' }],
      // eslint-disable-next-line no-new-wrappers
      [new String('bar'), { foo: String }],
      // eslint-disable-next-line no-new-wrappers
      [new Number(42), { foo: Number }],
      // eslint-disable-next-line no-new-wrappers
      [new Boolean(true), { foo: Boolean }],
      [new Date(), { foo: Date }],
      // eslint-disable-next-line no-new-wrappers
      [new Error('xyzzy'), { foo: Error }],
      [() => { }, { foo: Function }],
    ];
    validValues.forEach((testValues) => {
      const value = testValues[0];
      const criteria = testValues[1];

      it(`does not throw when ${value !== module ? JSON.stringify(value) : value} satisfies '${JSON.stringify(criteria, replacer)}'`, () => {
        expect(() => validate(value, criteria)).to.not.throw();
      });

      it(`does not call callback when ${value !== module ? JSON.stringify(value) : value} satisfies '${JSON.stringify(criteria, replacer)}'`, () => {
        let err;
        validate(value, criteria, (cbErr) => {
          err = cbErr;
        });
        expect(err).to.equal(undefined);
      });
    });

    const invalidValues = [
      [1, { foo: 'boolean' }],
      ['false', { foo: 'boolean' }],
      [{}, { foo: 'function' }],
      // eslint-disable-next-line no-new-wrappers
      [new Number(42), { foo: 'number' }],
      ['42', { foo: 'number' }],
      [false, { foo: 'number' }],
      // eslint-disable-next-line no-new-wrappers
      [String('foo'), { foo: 'object' }],
      // eslint-disable-next-line no-new-symbol
      [Symbol, { foo: 'symbol' }],
      ['foo', { foo: 'symbol' }],
      ['undefined', { foo: 'undefined' }],
      [Es5, { foo: Es5 }],
      [Es6, { foo: Es6 }],
      [{}, { foo: Array }],
      [{}.toString, { foo: String }],
      ['bar', { foo: String }],
      [42, { foo: Number }],
      [true, { foo: Boolean }],
      [Date.now(), { foo: Date }],
      [Error, { foo: Error }],
    ];
    invalidValues.forEach((testValues) => {
      const value = testValues[0];
      const criteria = testValues[1];

      it(`throws PvError when ${value !== module ? JSON.stringify(value) : value} does NOT satisfy '${JSON.stringify(criteria, replacer)}'`, () => {
        expect(() => validate(value, criteria)).to.throw(PvError);
      });

      it(`calls callback with PvError when ${value !== module ? JSON.stringify(value) : value} satisfies '${JSON.stringify(criteria, replacer)}'`, () => {
        let err;
        validate(value, criteria, (cbErr) => {
          err = cbErr;
        });
        expect(err).to.be.an.instanceOf(PvError);
      });
    });
  });
});
