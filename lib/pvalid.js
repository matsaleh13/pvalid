
class PValidError extends Error {
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, PValidError); // NOTE: node.js only.
  }
}

class PValidTypeError extends PValidError {
  constructor(name, expectedType, value) {
    const message = `Parameter: ${name} must be a ${expectedType}; actual: ${value}.`;
    super(message);
    Error.captureStackTrace(this, PValidTypeError); // NOTE: node.js only.
  }
}

class PValidRequiredError extends PValidError {
  constructor(name) {
    const message = `Parameter: ${name} is required.`;
    super(message);
    Error.captureStackTrace(this, PValidRequiredError); // NOTE: node.js only.
  }
}

const isString = value => typeof value === 'string';
const isUndefined = value => typeof value === 'undefined';

const MAX_STRING = 40;
function trimLen(arg) {
  const elipsis = ' ...';
  const _arg = typeof arg === 'string' ? arg : arg.toString();
  return _arg.length > MAX_STRING ? _arg.substring(0, MAX_STRING - elipsis.length) + elipsis : _arg;
}

/**
 * Returns an error describing the actual and expected types of an invalid argument.
 *
 * @param {String} name
 * @param {Any} actual
 * @param {Any} expected
 * @return PValidError with an appropriate error message.
 */
function getTypeError(name, actual, expected) {
  // special case for Mongoose.
  const _expected = !isUndefined(expected.modelName) ? expected.modelName : expected;
  // TODO: other special cases?

  const actualType = !isUndefined(actual.constructor) ? actual.constructor : typeof actual;

  return new PValidError(`Invalid argument for ${trimLen(name)}; actual: ${trimLen(actual)} (${trimLen(actualType)}) expected: ${trimLen(_expected)}`);
}


/**
 * Tests whether `value` is of a type that satisfies the `typeInfo` argument.
 *
 * @param {String} name
 * @param {Any} value
 * @param {Object} typeInfo
 */
function checkTypeOrInstance(name, value, typeInfo) {
  if (!isString(name)) return new PValidTypeError('name', 'string', name);
  if (!typeInfo) return new PValidRequiredError('typeInfo');

  if (value === null || isUndefined(value) || (typeof value === 'string' && value.length === 0)) {
    // Valid; skip further checking.
    return null;
  }

  if (typeInfo instanceof Array) {
    // Multiple types possible.
    // Check each element type until we find a good one.
    let err;
    for (let ix = 0; ix < typeInfo.length; ix += 1) {
      err = checkTypeOrInstance(name, value, typeInfo[ix]);
      if (err === null) break;
    }

    return err;
  }

  if (typeInfo instanceof constructor) {
    // Assume we want an instance check.
    if (value instanceof typeInfo) {
      // Direct match, all good
      return null;
    }

    // TODO: DI or plugin for custom type validations?
    // if (value instanceof mongoose.Document && typeInfo.hasOwnProperty('schema')) {
    //   // Check schemas (required to test Mongoose Document instance against a Model instance
    //   if (value.schema !== typeInfo.schema) {
    //     return getTypeError(value, typeInfo);
    //   }
    //   return null;
    // }

    // No match
    return getTypeError(value, typeInfo);
  }

  if (typeof typeInfo === 'string') {
    // Assume we want a type check.
    // eslint-disable-next-line valid-typeof
    if (!(typeof value === typeInfo)) {
      return getTypeError(typeof value, typeInfo);
    }
    return null;
  }

  // Don't know what we want.
  return new PValidError(`Unable to validate parameter: ${trimLen(name)} with value: ${trimLen(value)}, of type ${trimLen(typeInfo)}.`);
}

module.exports = enableValidation => ({ PValidError });
