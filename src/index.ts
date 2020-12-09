#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable no-console */

// TODO:
// X 1. parse options and install accordingly
// 1. logging about what is being installed (proejct type).  spinner?
// X 2. edit eslint accordingly
// X 3. prune unused rules.  (Try out on react projects.  iching)
// 4. stylelint
// 5. husky
// 6. clean up and organize code
// 7. test locally, test on npm/npx.
// 7. help explaining how it's used, version.
// X 8. better repo naming.  ts-prettylint? ts-lintier.... just lintier?

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

// eslint-disable-next-line node/no-unsupported-features/node-builtins
import fs, { promises as fsa } from 'fs';
import path from 'path';
import { exit } from 'process';
import execa from 'execa';

import { getEslintRc } from './getEslintrc';
import { basePrettierRc } from './basePrettierRc';
import { getConfig } from './getConfig/getConfig';

const getDepList = ({ react, node }: { react: boolean; node: boolean }) => {
  return [
    'eslint',
    'prettier',
    '@typescript-eslint/eslint-plugin',
    '@typescript-eslint/parser',
    'eslint-config-prettier',
    'eslint-plugin-prettier',
    ...(node ? ['eslint-plugin-node'] : []),
    ...(react ? ['eslint-plugin-react', 'eslint-plugin-react-hooks'] : []),
  ];
};

const installDeps = async ({
  useYarn,
  node,
  react,
  airBnb,
}: {
  useYarn: boolean;
  node: boolean;
  react: boolean;
  airBnb?: boolean;
}) => {
  const inst = execa(useYarn ? 'yarn' : 'npm', [
    useYarn ? 'add' : 'install',
    ...getDepList({ node, react }),
    '-E',
    '-D',
  ]);
  console.log('Installing dependencies...');
  // eslint-disable-next-line no-unused-expressions
  inst.stdout?.pipe(process.stdout);
  // eslint-disable-next-line no-unused-expressions
  inst.stderr?.pipe(process.stderr);

  if (airBnb) {
    await installAirBnb({ useYarn, react });
  }
};

const installAirBnb = async ({
  react = true,
  useYarn = false,
}: { react?: boolean; useYarn?: boolean } = {}) => {
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

const updatePackageJson = async () => {
  const oldPackageJson = require(path.join(
    process.cwd(),
    'package.json'
  )) as Record<string, unknown>;

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

  // fs.writeFileSync(path.join(process.cwd(), 'package.json'), newPkg);
  return fsa.writeFile(path.join(process.cwd(), 'package.json'), newPkg);
};

const writePrettierRc = async () =>
  fsa.writeFile(
    path.join(process.cwd(), '.prettierrc'),
    JSON.stringify(basePrettierRc, null, 2)
  );

const writeEslintRc = async ({
  node,
  react,
}: {
  node: boolean;
  react: boolean;
}) =>
  fsa.writeFile(
    path.join(process.cwd(), '.eslintrc'),
    JSON.stringify(getEslintRc({ node, react }), null, 2)
  );

const main = async () => {
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

  const config = await getConfig();

  await installDeps({
    useYarn,
    react: config.projectType === 'React' || config.projectType === 'Both',
    node: config.projectType === 'Node' || config.projectType === 'Both',
    airBnb: config.airBnb,
  });

  await writePrettierRc();

  await writeEslintRc({
    react: config.projectType === 'React' || config.projectType === 'Both',
    node: config.projectType === 'Node' || config.projectType === 'Both',
  });

  await updatePackageJson();
};

main().catch(err => console.error(err));
