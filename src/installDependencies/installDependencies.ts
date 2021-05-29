/* eslint-disable no-console */
import execa from 'execa';
import ora, { Ora } from 'ora';

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
  const spinner = ora('Installing dependencies...').start();

  const inst = await execa(useYarn ? 'yarn' : 'npm', [
    useYarn ? 'add' : 'install',
    ...getDepList({ node, react, styleLint, sass, lintStaged }),
    '-E',
    '-D',
  ]);

  spinner.stopAndPersist();

  console.log(inst.stdout, inst.stderr);
  console.log();

  if (airBnb) {
    await installAirBnb({ useYarn, depsSpinner: spinner });

    return;
  }

  spinner.succeed();
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
  ];
};

const installAirBnb = async ({
  useYarn,
  depsSpinner,
}: {
  useYarn: boolean;
  depsSpinner: Ora;
}) => {
  const airBnbSpinner = ora('Installing airbnb...').start();

  const inst = await execa(useYarn ? 'yarn' : 'npm', [
    useYarn ? 'add' : 'install',
    ...[
      'eslint-config-airbnb-typescript',
      'eslint-plugin-import',
      'eslint-plugin-jsx-a11y',
    ],
    '-E',
    '-D',
  ]);

  airBnbSpinner.stopAndPersist();

  console.log(inst.stdout, inst.stderr);

  console.log();

  depsSpinner.succeed();

  airBnbSpinner.succeed();
};
