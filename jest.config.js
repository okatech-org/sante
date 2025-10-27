export default {
  testEnvironment: 'node',
  transform: {},
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'src/neural/**/*.js',
    '!src/neural/**/*.test.js'
  ]
};
