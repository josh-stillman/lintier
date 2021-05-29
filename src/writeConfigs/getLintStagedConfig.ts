export const getLintStagedConfig = (
  stylelint: boolean
) => `/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/restrict-template-expressions, no-undef */
module.exports = {
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
