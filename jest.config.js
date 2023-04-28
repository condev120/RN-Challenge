const config = {
  verbose: true,
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost/'
  },
  testPathIgnorePatterns: ['src/__tests__/utils'],
  preset: 'react-native'
}

module.exports = config
