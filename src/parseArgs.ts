// parse and return args with commander

import { program } from 'commander';

export const getArgs = () => {
  program
    .option('-r, --react', 'install react dependencies')
    .option('-n, --node', 'install node dependencies')
    .option('-a, --airbnb', 'install airbnb styleguide')
    .option('-s, --stylelint', 'install stylelint')
    .option('-h, --husky', 'install husky and lint-staged');
  // version etc.
  program.parse(process.argv);

  return program;
};
