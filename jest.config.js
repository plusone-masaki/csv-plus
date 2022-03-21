module.exports = {
  globals: {
    __static: '<rootDir>/public',
  },
  moduleNameMapper: {
    '^@@/(.*)$': '<rootDir>/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^~/(.*)$': '<rootDir>/src/$1',
    electron: '<rootDir>/tests/unit/mocks/electron',
  },
  preset: '@vue/cli-plugin-unit-jest/presets/typescript',
  testMatch: ['<rootDir>/tests/unit/**/*(*.)@(spec|test).[jt]s?(x)'],
  transform: {
    '^.+\\.vue$': 'vue-jest',
  },
  setupFiles: ['<rootDir>/tests/unit/setup.ts'],
  verbose: true,
}
