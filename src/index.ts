#!/usr/bin/env node

/* eslint-disable no-console */

import fs from 'fs';
import path from 'path';
import { exit } from 'process';

import ora from 'ora';

import execa from 'execa';
import { getConfig } from './getOptions/getOptions';
import { installDeps } from './installDependencies/installDependencies';
import {
  updatePackageJson,
  writeEslintRc,
  writeEslintTsconfig,
  writeLintStagedConfig,
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
    lintStaged,
  } = await getConfig();

  await installDeps({
    useYarn,
    react,
    node,
    airBnb,
    styleLint,
    sass,
    lintStaged,
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

  if (lintStaged) {
    const lintStagedSpinner = ora('Writing lint-staged config...').start();

    await writeLintStagedConfig({ styleLint });

    lintStagedSpinner.succeed();
  }

  const packageSpinner = ora(
    'Updating package.json with lint scripts...'
  ).start();

  await updatePackageJson({
    styleLint,
    lintStaged,
    sass,
    styledComponents,
  });

  if (lintStaged) {
    // register git hooks after updating package.json
    await execa('npx', ['simple-git-hooks']);
  }

  packageSpinner
    .succeed()
    .stopAndPersist({ text: successMessage(styleLint), symbol: '🎉' });
};

main().catch(err => console.error(err));
