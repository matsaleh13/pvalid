module.exports = {
  extends: 'airbnb-base',
  env: {
    mocha: true
  },
  rules: {
    'no-underscore-dangle': 0,
    'max-len': [2, 120, { ignorePattern: 'it\\s*\\(.*$' }]
  }
};
