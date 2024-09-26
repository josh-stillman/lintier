export const getLintStagedConfig = (stylelint: boolean) => `
export default {
  './src/**/*.{js,jsx,ts,tsx}': files => [
    'tsc -p tsconfig.json --noEmit',
    \`eslint \${files.join(' ')} --fix\`,
  ],${
    stylelint
      ? `
  '*.{scss,css}': 'stylelint --fix',`
      : ''
  }
};
`;
