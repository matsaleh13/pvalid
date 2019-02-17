const { expect } = require('chai');

const NS_PER_SEC = 1e9;

function splitAndParse() {
  const test = '0,1,2,3,4,5,6,7,8,9';
  return test.split(',').forEach(e => parseInt(e, 10));
}

function timeIt(func, calls) {
  const _calls = calls || 1;

  const start = process.hrtime();
  for (let ix = 0; ix < _calls; ix += 1) {
    func();
  }
  return process.hrtime(start);
}

function logElapsed(elapsed, calls, memo) {
  let result = '';
  if (memo) result += `${memo} `;
  if (calls) result += `calls: ${calls}, `;
  result += `time: ${elapsed[0] * NS_PER_SEC + elapsed[1]} nanoseconds`;
  return result;
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

    function validate3AndCall(p1, p2, p3) {
      pv(p1, { p1: 'string' });
      pv(p2, { p2: 'object' });
      pv(p3, { p3: 'number' });
      return splitAndParse();
    }

    // pre-call
    splitAndParse();
    validate0AndCall();
    validate1AndCall('foo');
    validate2AndCall('bar', {});
    validate3AndCall('baz', { f: 0 }, 42);

    xit('time to call splitAndParse', () => {
      const calls = 1000;
      const result = timeIt(() => splitAndParse(), calls);
      console.log(logElapsed(result));
    });

    it('time to validate 0 params then call with success', () => {
      const calls = 1000;
      const result = timeIt(() => validate0AndCall(), calls);
      console.log(logElapsed(result));
    });

    it('time to validate 1 string then call with success', () => {
      const calls = 1000;
      const result = timeIt(() => validate1AndCall('foo'), calls);
      console.log(logElapsed(result));
    });

    it('time to validate 1 string and 1 object then call with success', () => {
      const calls = 1000;
      const result = timeIt(() => validate2AndCall('bar', {}), calls);
      console.log(logElapsed(result));
    });

    it('time to validate 1 string and 1 object and 1 number then call with success', () => {
      const calls = 1000;
      const result = timeIt(() => validate3AndCall('baz', { f: 0 }, 42), calls);
      console.log(logElapsed(result));
    });
  });

  describe('#disabled makes validation calls no-op', () => {
    // eslint-disable-next-line global-require
    const { pv } = require('../lib')({ disabled: true });

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

    function validate3AndCall(p1, p2, p3) {
      pv(p1, { p1: 'string' });
      pv(p2, { p2: 'object' });
      pv(p3, { p3: 'number' });
      return splitAndParse();
    }

    // pre-call
    splitAndParse();
    validate0AndCall();
    validate1AndCall('foo');
    validate2AndCall('bar', {});
    validate3AndCall('baz', { f: 0 }, 42);

    xit('time to call splitAndParse', () => {
      const calls = 1000;
      const result = timeIt(() => splitAndParse(), calls);
      console.log(logElapsed(result));
    });

    it('time to validate 0 params then call with success', () => {
      const calls = 1000;
      const result = timeIt(() => validate0AndCall(), calls);
      console.log(logElapsed(result));
    });

    it('time to validate 1 string then call with success', () => {
      const calls = 1000;
      const result = timeIt(() => validate1AndCall('foo'), calls);
      console.log(logElapsed(result));
    });

    it('time to validate 1 string and 1 object then call with success', () => {
      const calls = 1000;
      const result = timeIt(() => validate2AndCall('bar', {}), calls);
      console.log(logElapsed(result));
    });

    it('time to validate 1 string and 1 object and 1 number then call with success', () => {
      const calls = 1000;
      const result = timeIt(() => validate3AndCall('baz', { f: 0 }, 42), calls);
      console.log(logElapsed(result));
    });
  });
});
