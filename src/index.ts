#!/usr/bin/env node

/* eslint-disable no-console */

// TODO:
// X 1. parse options and install accordingly
// X 1. logging about what is being installed (proejct type).  spinner?
// X 2. edit eslint accordingly
// X 3. prune unused rules.  (Try out on react projects.  iching)
// X 8. better repo naming.  ts-prettylint? ts-lintier.... just lintier?
// X 6. spinners / new lines after logs
// X 4. stylelint
// X 6. clean up and organize code (alter config obj)
// X 7. new lines before spinner output.
// X 7. help explaining how it's used, version,
// X 7. readme.

// 8. tests?
// 8. write separate eslint ts.config for project?
// 5. husky
// 9. get rid of console log for options
// 10. add question about proceeding without git?
// 7. test on npx.

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

  const {
    react,
    node,
    airBnb,
    styleLint,
    styledComponents,
    sass,
    husky,
  } = await getConfig();

  console.log({
    react,
    node,
    airBnb,
    styleLint,
    styledComponents,
    sass,
    husky,
  });

  console.log();

  await installDeps({
    useYarn,
    react,
    node,
    airBnb,
    styleLint,
    sass,
  });

  const eslintSpinner = ora('Writing .prettierrc...').start();

  await writePrettierRc();

  // TODO: move spinners into methods?
  const prettierSpinner = eslintSpinner.succeed().start('Writing .eslintrc...');

  await writeEslintRc({
    react,
    node,
    airBnb,
  });

  prettierSpinner.succeed();

  if (styleLint) {
    const stylelintSpinner = ora('Writing .stylelintrc...').start();

    await writeStylelintRc({ sass });

    stylelintSpinner.succeed();
  }

  const packageSpinner = ora(
    'Updating package.json with lint scripts...'
  ).start();

  await updatePackageJson({
    styleLint,
    // husky,
    sass,
    styledComponents,
  });

  packageSpinner
    .succeed()
    .stopAndPersist({ text: successMessage(styleLint), symbol: '🎉' });
};

// link to vs code extensions?
const successMessage = (styleLint: boolean) => `Successfully installed eslint${
  styleLint ? ' & stylelint' : ''
} & prettier.

Next steps:
1. Edit .rc files to your liking.
2. Install eslint${styleLint ? ' & stylelint' : ''} VS Code plugins.
3. Edit your VS Code settings.json to enable auto-format on save:

  "editor.codeActionsOnSave": {
    "source.fixAll": true
  }"

Lintier out ✌️
`;

main().catch(err => console.error(err));
