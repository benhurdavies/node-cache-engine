// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: false,

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // Write coverage as text and html
  coverageReporters: ['text', 'html'],

  // Collect coverage for all files
  collectCoverageFrom: ['src/**/*.{js,jsx}'],

  // The test environment that will be used for testing
  testEnvironment: 'node',
};
