/* eslint-disable no-console */
import execa from 'execa';
import ora from 'ora';
import chalk from 'chalk';
import { PROGRESS_MESSAGES } from '../progressMessages';

export const installDeps = async ({
  useYarn,
  node,
  react,
  airBnb,
  styleLint,
  sass,
  lintStaged,
}: {
  useYarn: boolean;
  node: boolean;
  react: boolean;
  airBnb: boolean;
  styleLint: boolean;
  sass: boolean;
  lintStaged: boolean;
}) => {
  const spinner = ora(chalk.cyan(PROGRESS_MESSAGES.dependencies)).start();

  await execa(useYarn ? 'yarn' : 'npm', [
    useYarn ? 'add' : 'install',
    ...getDepList({ node, react, styleLint, sass, lintStaged }),
    '-E',
    '-D',
    '--force',
  ]);

  spinner.succeed(chalk.green(PROGRESS_MESSAGES.dependencies));

  if (airBnb) {
    await installAirBnb({ useYarn, react });
  }
};

export const getDepList = ({
  react,
  node,
  styleLint,
  sass,
  lintStaged,
}: {
  react: boolean;
  node: boolean;
  styleLint: boolean;
  sass: boolean;
  lintStaged: boolean;
}) => {
  return [
    'eslint',
    'prettier',
    '@typescript-eslint/eslint-plugin',
    '@typescript-eslint/parser',
    'eslint-config-prettier',
    'eslint-plugin-prettier',
    ...(node ? ['eslint-plugin-node'] : []),
    ...(react ? ['eslint-plugin-react', 'eslint-plugin-react-hooks'] : []),
    ...(styleLint
      ? [
          'stylelint',
          'stylelint-config-prettier',
          'stylelint-prettier',
          'stylelint-config-standard',
          ...(sass ? ['stylelint-config-sass-guidelines'] : []),
        ]
      : []),
    ...(lintStaged ? ['simple-git-hooks', 'lint-staged'] : []),
  ].map(entry => `${entry}@latest`);
};

const installAirBnb = async ({
  useYarn,
  react,
}: {
  useYarn: boolean;
  react: boolean;
}) => {
  const airBnbSpinner = ora(chalk.cyan(PROGRESS_MESSAGES.airbnb)).start();

  await execa('npx', [
    'install-peerdeps',
    `-D${useYarn ? 'Y' : ''}`,
    '-x',
    '-E',
    react ? 'eslint-config-airbnb' : 'eslint-config-airbnb-base',
  ]);

  await execa(useYarn ? 'yarn' : 'npm', [
    useYarn ? 'add' : 'install',
    ...['eslint-config-airbnb-typescript'],
    '-E',
    '-D',
  ]);

  airBnbSpinner.succeed(chalk.green(PROGRESS_MESSAGES.airbnb));
};
