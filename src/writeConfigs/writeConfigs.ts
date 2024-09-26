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
  sass,
}: {
  styleLint: boolean;
  sass: boolean;
  lintStaged: boolean;
}) => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const packageJson = require(
    path.join(process.cwd(), 'package.json')
  ) as Record<string, unknown>;

  const eslintScript = 'eslint .';

  const stylelintScript = `stylelint --ignore-path .gitignore '**/*.{css,scss,sass}'`;

  packageJson.scripts = {
    ...(packageJson.scripts as object | undefined),
    ...{
      lint: `${eslintScript}${styleLint ? ` ; ${stylelintScript}` : ''}`,
      'lint:fix': `npm run lint -- --fix${
        styleLint ? ` ; ${stylelintScript} --fix` : ''
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
