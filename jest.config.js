/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  verbose: true,
  testEnvironment: 'node',
  modulePathIgnorePatterns: ["dist"]
};