#!/usr/bin/env node

/* eslint-disable no-console */

import fs from 'fs';
import path from 'path';
import { exit } from 'process';

import ora from 'ora';
import chalk from 'chalk';

import execa from 'execa';
import { getConfig } from './getOptions/getOptions';
import { installDeps } from './installDependencies/installDependencies';
import {
  updatePackageJson,
  writeEslintConfig,
  writeLintStagedConfig,
  writePrettierRc,
  writeStylelintRc,
} from './writeConfigs/writeConfigs';
import { successMessage } from './successMessage';
import { PROGRESS_MESSAGES } from './progressMessages';

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
    // airBnb,
    styleLint,
    styledComponents,
    sass,
    lintStaged,
  } = await getConfig();

  await installDeps({
    useYarn,
    react,
    node,
    // airBnb,
    styleLint,
    sass,
    lintStaged,
  });

  const prettierSpinner = ora(chalk.cyan(PROGRESS_MESSAGES.prettier)).start();

  await writePrettierRc();

  // TODO: move spinners into methods?
  const eslintSpinner = prettierSpinner
    .succeed(chalk.green(PROGRESS_MESSAGES.prettier))
    .start(chalk.cyan(PROGRESS_MESSAGES.eslint));

  await writeEslintConfig({
    react,
    node,
    // airBnb,
  });

  eslintSpinner.succeed(chalk.green(PROGRESS_MESSAGES.eslint));

  if (styleLint) {
    const stylelintSpinner = ora(
      chalk.cyan(PROGRESS_MESSAGES.stylelint)
    ).start();

    await writeStylelintRc({ sass });

    stylelintSpinner.succeed(chalk.green(PROGRESS_MESSAGES.stylelint));
  }

  if (lintStaged) {
    const lintStagedSpinner = ora(
      chalk.cyan(PROGRESS_MESSAGES.lintStaged)
    ).start();

    await writeLintStagedConfig({ styleLint });

    lintStagedSpinner.succeed(chalk.green(PROGRESS_MESSAGES.lintStaged));
  }

  const packageSpinner = ora(chalk.cyan(PROGRESS_MESSAGES.packageJson)).start();

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
    .succeed(chalk.green(PROGRESS_MESSAGES.packageJson))
    .stopAndPersist({ text: successMessage(styleLint), symbol: '🎉' });
};

main().catch(err => console.error(err));
