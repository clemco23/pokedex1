export default {
  testEnvironment: 'node',
  testMatch: ['<rootDir>/test/**/*.test.[jt]s?(x)', '<rootDir>/tests/**/*.test.[jt]s?(x)'],
  clearMocks: true,
  restoreMocks: true,
  extensionsToTreatAsEsm: ['.jsx'],
  transform: {
    '^.+\\.[jt]sx?$': ['babel-jest', {
      presets: [['@babel/preset-react', { runtime: 'automatic' }]],
    }],
  },
  coverageProvider: 'v8',
  collectCoverageFrom: ['src/**/*.{js,jsx}'],
  coverageDirectory: './coverage',
  coverageReporters: ['text', 'html', 'lcov'],
}
