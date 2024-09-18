/* eslint-disable node/no-unsupported-features/node-builtins */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable no-console */

import { promises as fsa } from 'fs';
import path from 'path';

import { basePrettierRc } from './basePrettierRc';
import { getBaseStylelintRc } from './baseStylelintRc';
import { getEslintConfig } from './getEslintConfig';
import { getLintStagedConfig } from './getLintStagedConfig';

export const updatePackageJson = async ({
  styleLint,
  lintStaged,
  styledComponents,
  sass,
}: {
  styleLint: boolean;
  styledComponents: boolean;
  sass: boolean;
  lintStaged: boolean;
}) => {
  const packageJson = require(path.join(
    process.cwd(),
    'package.json'
  )) as Record<string, unknown>;

  const eslintScript = 'eslint .';

  const stylelintScript = `stylelint --ignore-path .gitignore '**/*.{css${
    sass ? ',scss,sass' : ''
  }${styledComponents ? ',js,ts,jsx,tsx' : ''}}'`;

  packageJson.scripts = {
    // eslint-disable-next-line @typescript-eslint/ban-types
    ...(packageJson.scripts as Object | undefined),
    ...{
      lint: `${eslintScript}${styleLint ? ` && ${stylelintScript}` : ''}`,
      'lint:fix': `npm run lint -- --fix${
        styleLint ? ` && ${stylelintScript} --fix` : ''
      }`,
    },
  };

  if (lintStaged) {
    packageJson['simple-git-hooks'] = {
      'pre-commit': 'npx lint-staged',
    };
  }

  return writeLocalFile('package.json', packageJson);
};

export const writePrettierRc = async () =>
  writeLocalFile('.prettierrc', basePrettierRc);

export const writeStylelintRc = async ({ sass }: { sass: boolean }) =>
  writeLocalFile('.stylelintrc', getBaseStylelintRc({ sass }));

export const writeLintStagedConfig = async ({
  styleLint,
}: {
  styleLint: boolean;
}) =>
  writeLocalFileString(
    'lint-staged.config.mjs',
    getLintStagedConfig(styleLint)
  );

// TODO: update arguments
export const writeEslintConfig = async ({
  node,
  react,
}: // airBnb,
{
  node: boolean;
  react: boolean;
  // airBnb: boolean;
}) =>
  writeLocalFileString('eslint.config.mjs', getEslintConfig({ react, node }));

const writeLocalFile = async (
  fileName: string,
  json: Record<string, unknown>
) =>
  fsa.writeFile(
    path.join(process.cwd(), fileName),
    JSON.stringify(json, null, 2)
  );

const writeLocalFileString = async (fileName: string, contents: string) =>
  fsa.writeFile(path.join(process.cwd(), fileName), contents);
