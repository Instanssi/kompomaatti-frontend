module.exports = {
    transform: {
        '^.+\\.jsx?$': 'babel-jest',
        '^.+\\.tsx?$': 'ts-jest'
    },
    testRegex: '(/__tests__/.*|(\\.|/)(test))\\.(jsx?|tsx?)$',
    // Automatically reset mocks between tests. Avoids some boilerplate in test suites.
    resetMocks: true,
    // Importing options
    moduleDirectories: ['.', 'node_modules'],
    moduleFileExtensions: [
        'ts',
        'tsx',
        'js',
        'jsx',
        'json',
        'node'
    ],
    setupFiles: [
        // these are run just as Jest is setting up a testing environment
        '<rootDir>/scripts/tests/testSetup.js',
    ],
    moduleNameMapper: {
        '\\.scss$': '<rootDir>/scripts/tests/mockFile.js'
    },
    collectCoverage: true,
    collectCoverageFrom: [
        'src/**/*.{ts,tsx,js,jsx}',
        '!src/config.*.{ts,js,json}',
        '!**/*.d.ts',
        '!**/node_modules/**',
    ],
    coverageReporters: ['json', 'lcov'],
    globals: {
        'NODE_ENV': 'test',
        'ts-jest': {
            'useBabelrc': true
        }
    }
};
