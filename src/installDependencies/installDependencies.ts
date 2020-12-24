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
}: {
  useYarn: boolean;
  node: boolean;
  react: boolean;
  airBnb: boolean;
  styleLint: boolean;
  sass: boolean;
}) => {
  const spinner = ora('Installing dependencies...').start();

  const inst = await execa(useYarn ? 'yarn' : 'npm', [
    useYarn ? 'add' : 'install',
    ...getDepList({ node, react, styleLint, sass }),
    '-E',
    '-D',
  ]);

  spinner.stopAndPersist();

  console.log(inst.stdout, inst.stderr);
  console.log();

  if (airBnb) {
    await installAirBnb({ useYarn, react, depsSpinner: spinner });

    return;
  }

  spinner.succeed();
};

const getDepList = ({
  react,
  node,
  styleLint,
  sass,
}: {
  react: boolean;
  node: boolean;
  styleLint: boolean;
  sass: boolean;
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
  ];
};

const installAirBnb = async ({
  react,
  useYarn,
  depsSpinner,
}: {
  react: boolean;
  useYarn: boolean;
  depsSpinner: Ora;
}) => {
  const airBnbSpinner = ora('Installing airbnb...').start();

  const inst = await execa('npx', [
    'install-peerdeps',
    `-D${useYarn ? 'Y' : ''}`,
    '-x',
    '-E',
    react ? 'eslint-config-airbnb' : 'eslint-config-airbnb-base',
  ]);

  airBnbSpinner.stopAndPersist();

  console.log(inst.stdout, inst.stderr);

  console.log();

  depsSpinner.succeed();

  airBnbSpinner.succeed();
};
