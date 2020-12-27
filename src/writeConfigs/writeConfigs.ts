/* eslint-disable node/no-unsupported-features/node-builtins */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable no-console */

import { promises as fsa } from 'fs';
import path from 'path';

import { basePrettierRc } from './basePrettierRc';
import { getBaseStylelintRc } from './baseStylelintRc';
import { getEslintRc } from './getEslintrc';
import { getEslintTsconfig } from './getEslintTsconfig';

export const updatePackageJson = async ({
  styleLint,
  // husky,
  styledComponents,
  sass,
}: {
  styleLint: boolean;
  styledComponents: boolean;
  sass: boolean;
  // husky: boolean;
}) => {
  const oldPackageJson = require(path.join(
    process.cwd(),
    'package.json'
  )) as Record<string, unknown>;

  const eslintScript =
    'eslint --ext .js,.jsx,.ts,.tsx --ignore-path .gitignore .';

  const stylelintScript = `stylelint --ignore-path .gitignore '**/*.{css${
    sass ? ',scss,sass' : ''
  }${styledComponents ? ',js,ts,jsx,tsx' : ''}}'`;

  oldPackageJson.scripts = {
    // eslint-disable-next-line @typescript-eslint/ban-types
    ...(oldPackageJson.scripts as Object | undefined),
    ...{
      lint: `${eslintScript}${styleLint ? ` && ${stylelintScript}` : ''}`,
      'lint:fix': `${eslintScript} --fix${
        styleLint ? ` && ${stylelintScript} --fix` : ''
      }`,
    },
  };

  return writeLocalFile('package.json', oldPackageJson);
};

export const writeEslintTsconfig = async () =>
  writeLocalFile('tsconfig.eslint.json', getEslintTsconfig());

export const writePrettierRc = async () =>
  writeLocalFile('.prettierrc', basePrettierRc);

export const writeStylelintRc = async ({ sass }: { sass: boolean }) =>
  writeLocalFile('.stylelintrc', getBaseStylelintRc({ sass }));

export const writeEslintRc = async ({
  node,
  react,
  airBnb,
}: {
  node: boolean;
  react: boolean;
  airBnb: boolean;
}) => writeLocalFile('.eslintrc', getEslintRc({ node, react, airBnb }));

const writeLocalFile = async (
  fileName: string,
  json: Record<string, unknown>
) =>
  fsa.writeFile(
    path.join(process.cwd(), fileName),
    JSON.stringify(json, null, 2)
  );
