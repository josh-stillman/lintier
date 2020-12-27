export const getEslintTsconfig = () => {
  return {
    extends: './tsconfig.json',
    exclude: [],
    include: ['./**/*'],
  };
};
