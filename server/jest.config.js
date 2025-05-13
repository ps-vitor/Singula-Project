module.exports={
    preset: "ts-jest",
    testEnviroment:    "node",
    setupFileAfterEnv:['<rootDir>/src/setupTests.ts'],
    moduleNameMapper:{
        '^@test-utils/(.*)$':'<rootDir>/src/test-utils/$1'
    }
};
