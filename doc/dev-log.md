# pvalid Developer log

## 2019-02-04

- Created project.
- Initial commit.

## 2019-02-09

- Setup ESLint:
  - Chose airbnb-base config.
- Initial cut of parameter type checking:
  - Check using typeof or instanceof.
  - Want to check special types e.g. Mongo models, but that should be via DI or custom plugin?
- Committed WIP stuff.

## 2019-02-10

- More implementation.
- Refactored utility functions and errors into their own modules.
- Added tests for util.js functions.

## 2019-02-16

- More validation tests:
  - instanceof checks.
- Implemented wrapper function that takes criteria parameter.
  - and tests.
- Implemented public interface that supports disabling validation.
  - and tests.
- Started perf tests.

