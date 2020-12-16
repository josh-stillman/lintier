/* eslint-disable no-console */
import execa from 'execa';
import ora, { Ora } from 'ora';

export const installDeps = async ({
  useYarn,
  node,
  react,
  airBnb,
}: {
  useYarn: boolean;
  node: boolean;
  react: boolean;
  airBnb: boolean;
}) => {
  const spinner = ora('Installing dependencies...').start();

  const inst = await execa(useYarn ? 'yarn' : 'npm', [
    useYarn ? 'add' : 'install',
    ...getDepList({ node, react }),
    '-E',
    '-D',
  ]);

  spinner.stopAndPersist();

  console.log(inst.stdout, inst.stderr);

  if (airBnb) {
    await installAirBnb({ useYarn, react, depsSpinner: spinner });

    return;
  }

  spinner.succeed();
};

const getDepList = ({ react, node }: { react: boolean; node: boolean }) => {
  return [
    'eslint',
    'prettier',
    '@typescript-eslint/eslint-plugin',
    '@typescript-eslint/parser',
    'eslint-config-prettier',
    'eslint-plugin-prettier',
    ...(node ? ['eslint-plugin-node'] : []),
    ...(react ? ['eslint-plugin-react', 'eslint-plugin-react-hooks'] : []),
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
  const airbnbSpinner = ora('Installing airbnb...').start();

  const inst = await execa('npx', [
    'install-peerdeps',
    `-D${useYarn ? 'Y' : ''}`,
    '-x',
    '-E',
    react ? 'eslint-config-airbnb' : 'eslint-config-airbnb-base',
  ]);

  airbnbSpinner.stopAndPersist();

  console.log(inst.stdout, inst.stderr);

  depsSpinner.succeed();

  airbnbSpinner.succeed();
};
