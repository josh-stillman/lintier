module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      tsconfig: {
        types: ['node', 'jest'],
        esModuleInterop: true,
        module: 'commonjs',
        lib: ['es2018'],
      },
    },
  },
};
