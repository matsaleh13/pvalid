const { expect } = require('chai');

describe('pvalid public interface', () => {
  describe('#enabled by default', () => {
    // eslint-disable-next-line global-require
    const { pv, PvError } = require('../lib')();

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

    it('pv throws PvError when validation fails and no callback provided', () => {
      expect(() => pv('42', { foo: 'number' })).to.throw(PvError);
    });

    it('pv calls callback with PvError when validation fails and callback provided', () => {
      let err;
      pv('42', { foo: 'number' }, (cbErr) => {
        err = cbErr;
      });
      expect(err).to.be.an.instanceOf(PvError);
    });
  });

  describe('#disabled makes validation calls no-op', () => {
    // eslint-disable-next-line global-require
    const { pv, PvError } = require('../lib')({ disabled: true });

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
      expect(() => pv('42', { foo: 'number' })).to.not.throw(PvError);
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
