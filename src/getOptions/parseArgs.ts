/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable global-require */

import { program } from 'commander';

const getNpmVersion = () => {
  const pkgJson = require('../../package.json');

  return pkgJson?.version || '1.0.0';
};

export const getArgs = () => {
  program
    .version(getNpmVersion())
    .name('npx lintier')
    .usage('[options] (in your project directory)')
    .description(
      'Scaffolds an eslint/prettier/stylelint setup in a TypeScript project. \n\nStarts in interactive mode, unless any options below are provided.'
    )
    .option('-r, --react', 'install react dependencies')
    .option('-n, --node', 'install node dependencies')
    .option('-a, --airBnb', 'install airbnb styleguide')
    .option('-s, --styleLint', 'install stylelint')
    .option(
      '-c, --styledComponents',
      'install styled-components / css-in-js lint script'
    )
    .option('-p, --sass', 'install sass stylelint config & lint script')
    .option('-h, --husky', 'install husky and lint-staged');

  program.parse(process.argv);

  return program.opts();
};
