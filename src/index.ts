#!/usr/bin/env node

/* eslint-disable no-console */

// TODO:
// X 1. parse options and install accordingly
// X 1. logging about what is being installed (proejct type).  spinner?
// X 2. edit eslint accordingly
// X 3. prune unused rules.  (Try out on react projects.  iching)
// X 8. better repo naming.  ts-prettylint? ts-lintier.... just lintier?

// 4. stylelint
// 5. husky
// 6. spinners / new lines after logs
// 6. clean up and organize code
// 7. help explaining how it's used, version.
// 7. test locally, test on npm/npx.

import fs from 'fs';
import path from 'path';
import { exit } from 'process';

import { getConfig } from './getOptions/getOptions';
import { installDeps } from './installDependencies/installDependencies';
import {
  updatePackageJson,
  writeEslintRc,
  writePrettierRc,
} from './writeConfigs/writeConfigs';

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
  console.log({ config });

  await installDeps({
    useYarn,
    // TODO update this.
    react: config.projectType === 'React' || config.projectType === 'Both',
    node: config.projectType === 'Node' || config.projectType === 'Both',
    airBnb: !!config.airBnb,
  });

  console.log('Writing .prettierrc...');
  await writePrettierRc();

  console.log('Writing .eslintrc...');
  await writeEslintRc({
    react: config.projectType === 'React' || config.projectType === 'Both',
    node: config.projectType === 'Node' || config.projectType === 'Both',
  });

  console.log('Updating package.json with lint scripts...');
  await updatePackageJson();

  printSuccessMessage();
};

const printSuccessMessage = () => {
  console.log(
    `Successfully installed eslint + prettier.

    Next steps:
    1. Edit .rc files to your liking.
    2. Add eslint (and stylelint) VS Code plugins.
    3. Edit your VS Code settings.json to enable auto-format on save:

      "editor.codeActionsOnSave": {
        "source.fixAll": true
      }"

    Lintier out ✌️
    `
  );
};

main().catch(err => console.error(err));
