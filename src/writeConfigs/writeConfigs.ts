/* eslint-disable node/no-unsupported-features/node-builtins */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable no-console */

import { promises as fsa } from 'fs';
import path from 'path';
import { basePrettierRc } from './basePrettierRc';
import { baseStylelintRc } from './baseStylelintRc';
import { getEslintRc } from './getEslintrc';

export const updatePackageJson = async ({
  styleLint,
  husky,
}: {
  styleLint: boolean;
  husky: boolean;
}) => {
  const oldPackageJson = require(path.join(
    process.cwd(),
    'package.json'
  )) as Record<string, unknown>;

  console.log({ husky });

  const eslintScript =
    'eslint --ext .js,.jsx,.ts,.tsx --ignore-path .gitignore .';

  const stylelintScript = 'stylelint --ignore-path .gitignore .';

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

export const writePrettierRc = async () =>
  writeLocalFile('.prettierrc', basePrettierRc);

export const writeStylelintRc = async () =>
  writeLocalFile('.stylelintrc', baseStylelintRc);

export const writeEslintRc = async ({
  node,
  react,
  airbnb,
}: {
  node: boolean;
  react: boolean;
  airbnb: boolean;
}) => writeLocalFile('.eslintrc', getEslintRc({ node, react, airbnb }));

const writeLocalFile = async (
  fileName: string,
  json: Record<string, unknown>
) =>
  fsa.writeFile(
    path.join(process.cwd(), fileName),
    JSON.stringify(json, null, 2)
  );
