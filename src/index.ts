/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable no-console */

// TODO:
// 1. parse options and install accordingly
// 1. logging about what is being installed (proejct type)
// 2. edit eslint accordingly
// 3. prune unused rules.  (Try out on react projects.  iching)
// 4. stylelint
// 5. husky
// 6. clean up and organize code
// 7. test locally, test on npm/npx.
// 7. help explaining how it's used.

// ///////

// 1. parse cli options
// 2. if none, prompt interactively

// 1. install eslint deps
// 2. write prettierRC
// 3. write eslint (per options)
// need to get path to tsconfig here.
// 4. add lint scripts to package.json
// 5. add stylelint deps
// 6. add stylelintrc
// 7. add husky and lint-staged

import fs from 'fs';
import path from 'path';
import { exit } from 'process';
import execa from 'execa';

import { getArgs } from './parseArgs';
import { question } from './questions';

// make these objects instead.  it's js baby.
import { baseEslintRc } from './baseEslintRc';
import { basePrettierRc } from './basePrettierRc';

const getDepList = () => {
  return [
    'eslint',
    'prettier',
    '@typescript-eslint/eslint-plugin',
    '@typescript-eslint/parser',
    'eslint-config-prettier',
    'eslint-plugin-prettier',
    'eslint-plugin-node',
    'eslint-plugin-react',
    'eslint-plugin-react-hooks',
  ];
};

const installDeps = async (useYarn?: boolean) => {
  const inst = execa(useYarn ? 'yarn' : 'npm', [
    useYarn ? 'add' : 'install',
    ...getDepList(),
    '-E',
    '-D',
  ]);
  console.log('Installing dependencies...');
  // eslint-disable-next-line no-unused-expressions
  inst.stdout?.pipe(process.stdout);
  // eslint-disable-next-line no-unused-expressions
  inst.stderr?.pipe(process.stderr);
};

const getEslintRc = () => {
  return JSON.stringify(baseEslintRc, null, 2);
};

const getPrettierRc = () => {
  return JSON.stringify(basePrettierRc, null, 2);
};

const installAirBnb = async (react = true, useYarn?: boolean) => {
  const inst = execa('npx', [
    'install-peerdeps',
    `-D${useYarn ? 'Y' : ''}`,
    '-x',
    '-E',
    react ? 'eslint-config-airbnb' : 'eslint-config-airbnb-base',
  ]);

  console.log('Installing airbnb...');
  // eslint-disable-next-line no-unused-expressions
  inst.stdout?.pipe(process.stdout);
  // eslint-disable-next-line no-unused-expressions
  inst.stderr?.pipe(process.stderr);
};

const main = async () => {
  // 0. guarding on proper dir and has git
  const hasPackageJson = fs.existsSync(
    path.join(process.cwd(), 'package.json')
  );
  const hasGit = fs.existsSync(path.join(process.cwd(), '.git/'));

  if (!hasPackageJson) {
    console.log('Missing package.json in directory.  Exiting');
    exit(1);
  }

  if (!hasGit) {
    console.log('No git detected.');
    // prompt for continue?
    exit(1);
  }

  // 0.A.; setup
  const useYarn = fs.existsSync(path.join(process.cwd(), 'yarn.lock'));

  // 1. get options / ask questions
  const program = getArgs();

  console.log(program.opts());

  let answers;

  if (Object.values(program.opts()).every(opt => opt === undefined)) {
    answers = await question();
  }

  console.log(answers);
  console.log('here');

  const oldPackageJson = require(path.join(
    process.cwd(),
    'package.json'
  )) as Record<string, unknown>;

  // const obj = JSON.parse(oldPackageJson, JSON.stringify(oldPackageJson));
  // console.log('package json is', oldPackageJson)

  oldPackageJson.scripts = {
    // eslint-disable-next-line @typescript-eslint/ban-types
    ...(oldPackageJson.scripts as Object | undefined),
    ...{
      lint: 'eslint --ext .js,.jsx,.ts,.tsx --ignore-path .gitignore .',
      'lint:fix':
        'eslint --ext .js,.jsx,.ts,.tsx --ignore-path .gitignore --fix .',
    },
  };

  const newPkg = JSON.stringify(oldPackageJson, null, 2);
  console.log('new process json', newPkg);
  console.log('has pkg json in dir', hasPackageJson);
  console.log('has git in dir', hasGit);
  console.log('use yarn', useYarn);

  fs.writeFileSync(path.join(process.cwd(), 'package.json'), newPkg);

  const eslintRc = getEslintRc();
  fs.writeFileSync(path.join(process.cwd(), '.eslintrc'), eslintRc);

  const prettierRc = getPrettierRc();
  fs.writeFileSync(path.join(process.cwd(), '.prettierrc'), prettierRc);

  await installDeps(useYarn);
  await installAirBnb();
};

main().catch(err => console.error(err));
