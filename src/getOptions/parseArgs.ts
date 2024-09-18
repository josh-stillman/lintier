import { program } from 'commander';
import pkgJson from '../../package.json';

const getNpmVersion = () => {
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
    // .option('-a, --airBnb', 'install airbnb styleguide')
    .option('-s, --styleLint', 'install stylelint')
    .option('-p, --sass', 'install sass stylelint config & lint script')
    .option('-l, --lintStaged', 'install lint-staged');

  program.parse(process.argv);

  return program.opts();
};
