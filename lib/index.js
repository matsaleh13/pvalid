const { validate } = require('./wrapper');
const { PvError } = require('./error');

const returnObj = {
  pv: null,
  PvError,
};

module.exports = (options) => {
  if (options && options.disabled) {
    returnObj.pv = () => { }; // no-op
  } else {
    returnObj.pv = validate;
  }
  return returnObj;
};
