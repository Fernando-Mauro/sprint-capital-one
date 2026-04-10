module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/frontend/tests', '<rootDir>/utils'],
  testMatch: [
    '**/frontend/tests/unit/**/*.test.(ts|tsx)',
    '**/utils/**/*.test.ts',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/frontend/src/$1',
  },
  coverageDirectory: 'coverage',
};