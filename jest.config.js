module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  // Actualizamos roots para que incluya tanto la carpeta frontend como la raíz donde está /utils
  roots: ['<rootDir>/frontend/tests', '<rootDir>/utils'],
  testMatch: [
    '**/frontend/tests/unit/**/*.test.(ts|tsx|js)',
    '**/utils/**/*.test.js'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/frontend/src/$1',
  },
  // Si no tienes configurado testing-library aún, podrías comentar la línea de abajo para evitar errores
  // setupFilesAfterEnv: ['@testing-library/jest-dom'], 
  coverageDirectory: 'coverage',
};