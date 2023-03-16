/* eslint-disable global-require */

module.exports = (config) =>
  config.set({
    basePath: __dirname,
    browsers: ['ChromeCI'],
    captureTimeout: 60000,
    colors: true,
    frameworks: ['karma-typescript', 'mocha', 'chai', 'sinon'],
    plugins: [
      require('karma-typescript'),
      require('karma-chrome-launcher'),
      require('karma-mocha'),
      require('karma-chai'),
      require('karma-sinon'),
      require('karma-spec-reporter'),
    ],
    customLaunchers: {
      ChromeCI: {
        base: 'ChromeHeadless',
        flags: ['--disable-web-security'],
      },
    },
    reporters: ['spec', 'progress'],
    singleRun: false,
    exclude: [],
    files: ['src/**/*.ts', 'test/unit/**/*.spec.ts'],
    preprocessors: {
      '**/*.ts': 'karma-typescript',
    },
    karmaTypescriptConfig: {
      tsconfig: './test/tsconfig.json',
    },
  });
