module.exports = {
  globals: {
    __static: '<rootDir>/public',
  },
  moduleNameMapper: {
    '^@@/(.*)$': '<rootDir>/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^~/(.*)$': '<rootDir>/src/$1',
    '^@tests/(.*)$': '<rootDir>/tests/$1',
  },
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  testMatch: ['<rootDir>/tests/unit/**/*(*.)@(spec|test).[jt]s?(x)'],
  transformIgnorePatterns: ['/node_modules/(?!csv)'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.vue$': '@vue/vue3-jest',
  },
  setupFiles: ['<rootDir>/tests/unit/setup.ts'],
  setupFilesAfterEnv: ['<rootDir>/tests/unit/mocks/index.ts'],
  // verbose: true,
}
