import { promises as fsa } from 'fs';
import path from 'path';
import * as prettier from 'prettier';

import { basePrettierRc } from './basePrettierRc';
import { getBaseStylelintRc } from './baseStylelintRc';
import { getEslintConfig } from './getEslintConfig';
import { getLintStagedConfig } from './getLintStagedConfig';

export const updatePackageJson = async ({
  styleLint,
  lintStaged,
}: {
  styleLint: boolean;
  lintStaged: boolean;
}) => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const packageJson = require(
    path.join(process.cwd(), 'package.json')
  ) as Record<string, unknown>;

  packageJson.scripts = {
    ...(packageJson.scripts as object | undefined),
    ...getLintScripts(styleLint),
  };

  if (lintStaged) {
    packageJson['simple-git-hooks'] = {
      'pre-commit': 'npx lint-staged',
    };
  }

  return writeLocalFile('package.json', packageJson);
};

export const getLintScripts = (styleLint: boolean) => {
  const eslintScript = 'eslint .';

  const stylelintScript = `stylelint --ignore-path .gitignore '**/*.{css,scss,sass}'`;

  return {
    lint: `npm run lint-code${styleLint ? ` ; npm run lint-styles` : ''}`,
    ['lint:fix']: `npm run lint-code -- --fix${styleLint ? ` ; npm run lint-styles -- --fix` : ''}`,
    ['lint-code']: `${eslintScript}`,
    ...(styleLint ? { ['lint-styles']: `${stylelintScript}` } : {}),
  };
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
}) => {
  const file = getEslintConfig({ react, node });

  const formatted = await prettier.format(file, {
    ...basePrettierRc,
    parser: 'typescript',
  });

  writeLocalFileString('eslint.config.mjs', formatted);
};

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
