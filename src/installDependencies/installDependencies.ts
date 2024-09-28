import execa from 'execa';
import ora from 'ora';
import chalk from 'chalk';
import { PROGRESS_MESSAGES } from '../progressMessages';
import PINNED_VERSIONS from './pinnedVersions.json';

export const installDeps = async ({
  useYarn,
  node,
  react,
  // airBnb,
  styleLint,
  sass,
  lintStaged,
  pinned,
}: {
  useYarn: boolean;
  node: boolean;
  react: boolean;
  // airBnb: boolean;
  styleLint: boolean;
  sass: boolean;
  lintStaged: boolean;
  pinned: boolean;
}) => {
  const spinner = ora(chalk.cyan(PROGRESS_MESSAGES.dependencies)).start();

  const installProcess = execa(useYarn ? 'yarn' : 'npm', [
    useYarn ? 'add' : 'install',
    ...(await getDepList({ node, react, styleLint, sass, lintStaged, pinned })),
    '-E',
    '-D',
  ]);

  try {
    await installProcess;
  } catch (error) {
    spinner.fail();
    throw new Error(
      `Failed to install dependencies.  Please revert any changes with git.${!pinned ? ' \n\nYou should try passing the -p flag to use the last-known working dependency versions. This might required updating peer dependencies' : ''}\n\n Error message: ${error}`
    );
  }

  spinner.succeed(chalk.green(PROGRESS_MESSAGES.dependencies));

  // if (airBnb) {
  //   await installAirBnb({ useYarn, react });
  // }
};

export const getDepList = async ({
  react,
  node,
  styleLint,
  sass,
  lintStaged,
  pinned,
}: {
  react: boolean;
  node: boolean;
  styleLint: boolean;
  sass: boolean;
  lintStaged: boolean;
  pinned: boolean;
}) => {
  let pinnedJson = PINNED_VERSIONS;

  if (pinned) {
    // fetch updated list of pinned versions, falling back to version from published package
    try {
      const remotePinned = await fetch(
        'https://raw.githubusercontent.com/josh-stillman/lintier/refs/heads/main/src/installDependencies/pinnedVersions.json'
      );

      const json = (await remotePinned.json()) as typeof PINNED_VERSIONS;

      pinnedJson = json;

      console.log(`Using pinned versions from ${pinnedJson['_UPDATED_AT']}`);
    } catch (error) {
      console.error(
        `Error fetching remote list of pinned versions, falling back to list from ${PINNED_VERSIONS['_UPDATED_AT']}\n\n${error}`
      );
    }
  }

  return [
    'eslint',
    'prettier',
    '@eslint/js',
    '@types/eslint__js',
    'eslint-config-prettier',
    'eslint-plugin-prettier',
    'globals',
    'typescript-eslint',
    ...(node ? ['eslint-plugin-n'] : []),
    ...(react
      ? ['eslint-plugin-react' /* , 'eslint-plugin-react-hooks' */]
      : []),
    ...(styleLint
      ? [
          'stylelint',
          'stylelint-prettier',
          'stylelint-config-standard',
          ...(sass ? ['stylelint-config-sass-guidelines'] : []),
        ]
      : []),
    ...(lintStaged ? ['simple-git-hooks', 'lint-staged'] : []),
  ].map(
    packageName =>
      `${packageName}@${getVersion({ packageName, usePinned: pinned, pinnedJson })}`
  );
};

export const getVersion = ({
  packageName,
  usePinned,
  pinnedJson,
}: {
  packageName: string;
  usePinned: boolean;
  pinnedJson: typeof PINNED_VERSIONS;
}) =>
  !usePinned
    ? 'latest'
    : pinnedJson[packageName as keyof typeof PINNED_VERSIONS] || 'latest';

// const installAirBnb = async ({
//   useYarn,
//   react,
// }: {
//   useYarn: boolean;
//   react: boolean;
// }) => {
//   // const airBnbSpinner = ora(chalk.cyan(PROGRESS_MESSAGES.airbnb)).start();

//   await execa('npx', [
//     'install-peerdeps',
//     `-D${useYarn ? 'Y' : ''}`,
//     '-x',
//     '-E',
//     react ? 'eslint-config-airbnb' : 'eslint-config-airbnb-base',
//   ]);

//   await execa(useYarn ? 'yarn' : 'npm', [
//     useYarn ? 'add' : 'install',
//     ...['eslint-config-airbnb-typescript'],
//     '-E',
//     '-D',
//   ]);

//   // airBnbSpinner.succeed(chalk.green(PROGRESS_MESSAGES.airbnb));
// };
