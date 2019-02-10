//
// Error classes
//

class PvError extends Error {
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, PvError); // NOTE: node.js only.
  }
}

class PvTypeError extends PvError {
  constructor(name, value, expectedType) {
    const message = `Parameter: ${name} must be a ${expectedType}; actual: ${value}.`;
    super(message);
    Error.captureStackTrace(this, PvTypeError); // NOTE: node.js only.
  }
}

class PvValueError extends PvError {
  constructor(name, value, expectedValues) {
    const message = `Parameter: ${name} must statisfy: ${expectedValues}; actual: ${value}.`;
    super(message);
    Error.captureStackTrace(this, PvValueError); // NOTE: node.js only.
  }
}

class PvRequiredError extends PvError {
  constructor(name) {
    const message = `Parameter: ${name} is required.`;
    super(message);
    Error.captureStackTrace(this, PvRequiredError); // NOTE: node.js only.
  }
}
module.exports = {
  PvError,
  PvTypeError,
  PvValueError,
  PvRequiredError,
};
