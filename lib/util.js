const { PvTypeError } = require('./error');

//
// Constants
//

const VALID_TYPEOF_STRINGS = [
  'boolean',
  'function',
  'number',
  'object',
  'string',
  'symbol',
  'undefined',
];
const MAX_STRING = 40;

//
// Utility Functions
//

const isTypeofString = value => VALID_TYPEOF_STRINGS.includes(value);
const isString = value => typeof value === 'string' || value instanceof String;
const isUndefined = value => typeof value === 'undefined';
const isClass = value => typeof value === 'function' && !isUndefined(value.constructor);

function trimLen(arg) {
  if (!isString(arg)) throw new PvTypeError('arg', arg, 'string');
  const elipsis = ' ...';
  const _arg = typeof arg === 'string' ? arg : arg.toString();
  return _arg.length > MAX_STRING ? _arg.substring(0, MAX_STRING - elipsis.length) + elipsis : _arg;
}

module.exports = {
  VALID_TYPEOF_STRINGS,
  MAX_STRING,
  isTypeofString,
  isString,
  isUndefined,
  isClass,
  trimLen,
};
