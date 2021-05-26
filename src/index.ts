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
// X 8. write separate eslint ts.config for project?
// X 12. setup ci/cd tests and linting in github actions

// 8. styled components - try disabling stylelint/prettier for .ts/x files.

// 9. add hyperlinks to success msg for vs code plugins. https://github.com/sindresorhus/terminal-link
// 5. husky

// 10. add question about proceeding without git?
// 9. get rid of console log for options

// 1. Chalk colors?

// 13. setup ci/cd publish to npm on merge to main on github actions
// 10. Pin versions - one release pinned, one unpinned to catch new updates
// 7. test on npx.

// future considerations:
// // 11. use js files for configs.
// 1. Ink react components?

// move to GH project

import fs from 'fs';
import path from 'path';
import { exit } from 'process';

import ora from 'ora';

import { getConfig } from './getOptions/getOptions';
import { installDeps } from './installDependencies/installDependencies';
import {
  updatePackageJson,
  writeEslintRc,
  writeEslintTsconfig,
  writePrettierRc,
  writeStylelintRc,
} from './writeConfigs/writeConfigs';
import { successMessage } from './successMessage';

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

  const prettierSpinner = ora('Writing .prettierrc...').start();

  await writePrettierRc();

  // TODO: move spinners into methods?
  const eslintSpinner = prettierSpinner.succeed().start('Writing .eslintrc...');

  await writeEslintRc({
    react,
    node,
    airBnb,
  });

  const tsconfigSpinner = eslintSpinner
    .succeed()
    .start('Writing eslint tsconfig file...');

  await writeEslintTsconfig();

  tsconfigSpinner.succeed();

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

main().catch(err => console.error(err));
