/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/frontend/tests', '<rootDir>/utils'],
  testMatch: [
    '**/frontend/tests/unit/**/*.test.ts',
    '**/frontend/tests/unit/**/*.test.tsx',
    '**/utils/**/*.test.ts',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/frontend/src/$1',
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};

export default config;
