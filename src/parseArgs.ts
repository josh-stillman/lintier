// parse and return args with commander

import { program } from 'commander';

export const getArgs = () => {


program
.option('-a, --airbnb', 'install airbnb styleguide')
.option('-r, --react', 'install react dependencies')
// .option('-n, --node', 'install node dependencies') leaning node is default / base
.option('-s, --stylelint', 'install stylelint')
.option('-h, --husky', 'install husky and lint-staged')

// .option('-d, --debug', 'output extra debugging')
// .option('-s, --small', 'small pizza size')
//   .option('-p, --pizza-type <type>', 'flavour of pizza');

program.parse(process.argv);

return program;

// console.log(program.opts());
}
