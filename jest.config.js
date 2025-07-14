module.exports = {
    preset: 'ts-jest',
    transform: {
        '^.+\\.(ts|tsx)?$': 'ts-jest',
        '^.+\\.(js|jsx)$': 'babel-jest',
    },
    testPathIgnorePatterns: [
        "migration.spec.(ts|js)"
    ],
    setupFiles: ["<rootDir>/.jest/setEnvVars.js"]
};
