const { validateTypeOrInstance } = require('./pvalid');
const { PvValueError } = require('./error');

/**
 * List of known/expected fields in a `criteria` object.
 */
const KNOWN_CRITERIA_PROPS = [

];

/**
 * Validates a value against provided criteria.
 *
 * NOTES:
 * - The `criteria` object is of the form:
 *     { <name>: <typeInfo> }
 *   Where:
 *    `<name>` is the name of the variable or parameter to check.
 *    `<typeInfo>`is a valid `typeof` string or a Javascript ES6+ class or ES5 constructor function.
 *
 * - If the `errCb` callback is provided, a validation failure will cause `errCb` to be called
 *   with a `PvError` instance as its argument.
 * - If the `errCb` callback is not provided, a validation failure will cause a `PvError` instance
 *   to be thrown.
 *
 * @param {Any} value Value to be validated.
 * @param {Object} criteria Object containing metadata used in validation.
 * @param {Function} errCb Function that passes a PvError on failure and is not called on success.
 * @throws PvError when validation fails and `errCb` not provided.
 */
function validate(value, criteria, errCb) {
  const unknownKeys = Object.keys(criteria).filter(key => !KNOWN_CRITERIA_PROPS.includes(key));
  if (unknownKeys.length > 1) throw new PvValueError(`Detected more than one unknown key: ${unknownKeys}`);

  const [name] = unknownKeys;
  const typeInfo = criteria[name];
  const result = validateTypeOrInstance(name, value, typeInfo);
  if (result) {
    if (errCb) {
      errCb(result);
    } else {
      throw result;
    }
  }
}

module.exports = {
  validate,
};
