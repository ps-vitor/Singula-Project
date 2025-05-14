export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@test-utils/(.*)$': '<rootDir>/src/test-utils/$1'
  },
  transform: {
    '^.+\\.ts$': [
      'ts-jest', 
      {
        useESM: true,
        tsconfig: 'tsconfig.json',
        isolatedModules:true,
        diagnostics: {
          ignoreCodes: [1343]
        }
      }
    ]
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  resolver: 'jest-ts-webcompat-resolver',
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?)'
  ]
};