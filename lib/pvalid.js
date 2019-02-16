
const {
  isClass,
  isString,
  isTypeofString,
  isUndefined,
  trimLen,
  VALID_TYPEOF_STRINGS,
} = require('./util');
const {
  PvError,
  PvRequiredError,
  PvValueError,
  PvTypeError,
} = require('./error');

//
// Implementation
//

/**
 * Returns an error describing the actual and expected types of an invalid argument.
 *
 * @param {String} name
 * @param {Any} actual
 * @param {Any} expected
 * @return PValidError with an appropriate error message.
 */
function getTypeError(name, actual, expected) {
  const actualType = !isUndefined(actual.constructor) ? actual.constructor : typeof actual;

  return new PvTypeError(`Invalid argument for ${name};`
    + ` actual: ${trimLen(actual.toString())} (${trimLen(actualType.toString())})`
    + ` expected: ${trimLen(expected.toString())}`);
}


/**
 * Tests whether `value` is of a type that satisfies the `typeInfo` argument.
 *
 * NOTE: Passing invalid values to this function is a programming error, so we throw.
 * NOTE: Returns a `PvError` instance that callers may choose to throw or pass to a callback.
 *
 * @param {String} name Name of the parameter to check. Required.
 * @param {Any} value Value of the parameter to check. May be null or undefined.
 * @param {Object} typeInfo Info about the type to check for. Required. May be a `typeof` string or a Class.
 * @returns null on success; otherwise an instance of `PvError`.
 * @throws Instance of `PvError` when this function detects invalid parameters.
 */
function validateTypeOrInstance(name, value, typeInfo) {
  if (!isString(name)) throw new PvTypeError('name', name, 'string');
  if (!typeInfo) throw new PvRequiredError('typeInfo');
  if (isString(typeInfo) && !isTypeofString(typeInfo)) {
    throw new PvValueError('typeInfo', typeInfo, VALID_TYPEOF_STRINGS);
  }

  if (value === null || isUndefined(value) || (typeof value === 'string' && value.length === 0)) {
    // Value is optional, so valid; skip further checking.
    return null;
  }

  if (typeInfo instanceof Array) {
    // Multiple types possible.
    if (typeInfo.length === 0) {
      throw new PvValueError('typeInfo', typeInfo, 'must contain at least one element');
    }

    // Check each element type until we find a good one.
    let err;
    for (let ix = 0; ix < typeInfo.length; ix += 1) {
      const typeInfoElem = typeInfo[ix];
      if (typeInfoElem instanceof Array) {
        // Can't nest arrays (deep recursion).
        throw new PvValueError('typeInfo', typeInfo, 'cannot nest arrays');
      }

      // Recurse.
      err = validateTypeOrInstance(name, value, typeInfoElem);
      if (err === null) break;
    }

    return err;
  }

  if (isClass(typeInfo)) {
    // This is a "class" type.
    if (value instanceof typeInfo) {
      // Direct match, all good
      return null;
    }

    // No match.
    return getTypeError(name, value, typeInfo);
  }

  if (typeof typeInfo === 'function') {
    // TODO: custom type check function.
  }

  if (isString(typeInfo)) {
    // Assume we want a typeof check.
    // eslint-disable-next-line valid-typeof
    if (typeof value === typeInfo) {
      return null;
    }

    // No match.
    return getTypeError(name, value, typeInfo);
  }

  // Programming error: unhandled.
  throw new PvError(`Unable to validate parameter: ${trimLen(name)} with`
    + ` value: ${trimLen(value)}, of type ${trimLen(typeInfo)}.`);
}

module.exports = {
  validateTypeOrInstance,
};
