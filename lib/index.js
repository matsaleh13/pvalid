const { validate } = require('./wrapper');

const returnObj = {
  pv: null,
};

module.exports = (options) => {
  if (options && options.disabled) {
    returnObj.pv = () => { }; // no-op
  } else {
    returnObj.pv = validate;
  }
  return returnObj;
};
