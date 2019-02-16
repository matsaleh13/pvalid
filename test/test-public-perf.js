const { expect } = require('chai');

const NS_PER_SEC = 1e9;

function splitAndParse() {
  const test = '0,1,2,3,4,5,6,7,8,9';
  return test.split(',').forEach(e => parseInt(e, 10));
}

describe('pvalid public interface performance', () => {
  describe('#enabled', () => {
    // eslint-disable-next-line global-require
    const { pv, PvError } = require('../lib')();

    function validate0AndCall() {
      return splitAndParse();
    }

    function validate1AndCall(p1) {
      pv(p1, { p1: 'string' });
      return splitAndParse();
    }

    function validate2AndCall(p1, p2) {
      pv(p1, { p1: 'string' });
      pv(p2, { p2: 'object' });
      return splitAndParse();
    }

    // pre-call
    splitAndParse();
    validate0AndCall();
    validate1AndCall('foo');
    validate2AndCall('foo', {});

    it('time to call splitAndParse', () => {
      const calls = 100;
      const start = process.hrtime();
      for (let ix = 0; ix < calls; ix += 1) {
        splitAndParse();
      }
      const elapsed = process.hrtime(start);
      console.log(`calls: ${calls}, time: ${elapsed[0] * NS_PER_SEC + elapsed[1]} nanoseconds`);
    });

    it('time to validate 0 params then call with success', () => {
      const calls = 100;
      const start = process.hrtime();
      for (let ix = 0; ix < calls; ix += 1) {
        validate0AndCall();
      }
      const elapsed = process.hrtime(start);
      console.log(`calls: ${calls}, time: ${elapsed[0] * NS_PER_SEC + elapsed[1]} nanoseconds`);
    });

    it('time to validate 1 string then call with success', () => {
      const calls = 100;
      const start = process.hrtime();
      for (let ix = 0; ix < calls; ix += 1) {
        validate1AndCall('foo');
      }
      const elapsed = process.hrtime(start);
      console.log(`calls: ${calls}, time: ${elapsed[0] * NS_PER_SEC + elapsed[1]} nanoseconds`);
    });

    it('time to validate 1 string and 1 object then call with success', () => {
      const calls = 100;
      const start = process.hrtime();
      for (let ix = 0; ix < calls; ix += 1) {
        validate1AndCall('foo', {});
      }
      const elapsed = process.hrtime(start);
      console.log(`calls: ${calls}, time: ${elapsed[0] * NS_PER_SEC + elapsed[1]} nanoseconds`);
    });
  });

  describe.skip('#disabled makes validation calls no-op', () => {
    // eslint-disable-next-line global-require
    const { pv } = require('../lib')({ disabled: true });

    it('pv does not throw when validation succeeds and no callback provided', () => {
      expect(() => pv(42, { foo: 'number' })).to.not.throw();
    });

    it('pv does not call callback when validation succeeds and callback provided', () => {
      let err;
      pv(42, { foo: 'number' }, (cbErr) => {
        err = cbErr;
      });
      expect(err).to.equal(undefined);
    });

    it('pv DOES NOT throw PvError when validation fails and no callback provided', () => {
      expect(() => pv('42', { foo: 'number' })).to.not.throw();
    });

    it('pv DOES NOT call callback with PvError when validation fails and callback provided', () => {
      let err;
      pv('42', { foo: 'number' }, (cbErr) => {
        err = cbErr;
      });
      expect(err).to.equal(undefined);
    });
  });
});
