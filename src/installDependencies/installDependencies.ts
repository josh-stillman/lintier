/* eslint-disable no-console */
import execa from 'execa';

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
  console.log('Installing dependencies...');

  const inst = await execa(useYarn ? 'yarn' : 'npm', [
    useYarn ? 'add' : 'install',
    ...getDepList({ node, react }),
    '-E',
    '-D',
  ]);

  console.log(inst.stdout, inst.stderr);

  if (airBnb) {
    await installAirBnb({ useYarn, react });
  }
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
}: {
  react: boolean;
  useYarn: boolean;
}) => {
  console.log('Installing airbnb...');

  const inst = await execa('npx', [
    'install-peerdeps',
    `-D${useYarn ? 'Y' : ''}`,
    '-x',
    '-E',
    react ? 'eslint-config-airbnb' : 'eslint-config-airbnb-base',
  ]);

  console.log(inst.stdout, inst.stderr);
};
