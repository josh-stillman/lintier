#!/usr/bin/env node

/* eslint-disable no-console */

// TODO:
// X 1. parse options and install accordingly
// X 1. logging about what is being installed (proejct type).  spinner?
// X 2. edit eslint accordingly
// X 3. prune unused rules.  (Try out on react projects.  iching)
// X 8. better repo naming.  ts-prettylint? ts-lintier.... just lintier?
// X 6. spinners / new lines after logs

// 4. stylelint
// 5. husky
// 6. clean up and organize code (alter config obj)
// 7. help explaining how it's used, version.
// 7. test locally, test CRA, test on npm/npx.
// 8. tests?

import fs from 'fs';
import path from 'path';
import { exit } from 'process';

import ora from 'ora';

import { getConfig } from './getOptions/getOptions';
import { installDeps } from './installDependencies/installDependencies';
import {
  updatePackageJson,
  writeEslintRc,
  writePrettierRc,
  writeStylelintRc,
} from './writeConfigs/writeConfigs';

const main = async () => {
  const hasPackageJson = fs.existsSync(
    path.join(process.cwd(), 'package.json')
  );

  if (!hasPackageJson) {
    console.log('Missing package.json in directory.  Exiting');
    exit(1);
  }

  const hasGit = fs.existsSync(path.join(process.cwd(), '.git/'));
  if (!hasGit) {
    console.log('No git detected.');
    // prompt for continue?
    exit(1);
  }

  const useYarn = fs.existsSync(path.join(process.cwd(), 'yarn.lock'));

  const config = await getConfig();
  console.log({ config });

  await installDeps({
    useYarn,
    // TODO update this.
    react: config.projectType === 'React' || config.projectType === 'Both',
    node: config.projectType === 'Node' || config.projectType === 'Both',
    airBnb: !!config.airBnb,
    styleLint: !!config.styleLint,
  });

  const eslintSpinner = ora('Writing .prettierrc...').start();

  await writePrettierRc();

  // TODO: move spinners into methods?
  const prettierSpinner = eslintSpinner.succeed().start('Writing .eslintrc...');

  await writeEslintRc({
    react: config.projectType === 'React' || config.projectType === 'Both',
    node: config.projectType === 'Node' || config.projectType === 'Both',
    airbnb: !!config.airBnb,
  });

  prettierSpinner.succeed();

  if (config.styleLint) {
    const stylelintSpinner = ora('Writing .stylelintrc...').start();

    await writeStylelintRc();

    stylelintSpinner.succeed();
  }

  const packageSpinner = ora(
    'Updating package.json with lint scripts...'
  ).start();

  await updatePackageJson({
    styleLint: !!config.styleLint,
    husky: !!config.husky,
  });

  packageSpinner
    .succeed()
    .stopAndPersist({ text: successMessage(!!config.styleLint), symbol: '🎉' });
};

const successMessage = (styleLint: boolean) => `Successfully installed eslint${
  styleLint ? ' & stylelint' : ''
} & prettier.

Next steps:
1. Edit .rc files to your liking.
2. Add eslint${styleLint ? ' & stylelint' : ''} VS Code plugins.
3. Edit your VS Code settings.json to enable auto-format on save:

  "editor.codeActionsOnSave": {
    "source.fixAll": true
  }"

Lintier out ✌️
`;

main().catch(err => console.error(err));
