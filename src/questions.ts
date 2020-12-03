/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// ask questions if no args

import inquirer from 'inquirer';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const question = async () => {
  type ProjectType = 'React' | 'Node' | 'Both' | 'Neither';

  const projectType = ((await inquirer.prompt([
    {
      type: 'list',
      name: 'projectType',
      message: 'Install which plugins?',
      choices: ['React', 'Node', 'Both', 'Neither'],
      default: 'React',
    },
    {
      type: 'confirm',
      name: 'airbnb',
      message: 'Install AirBnb Style Guide Config?',
      default: true,
    },
  ])) as unknown) as {
    [key: string]: ProjectType | boolean;
  };

  const styleLint =
    projectType.projectType === 'React' || projectType.projectType === 'Both'
      ? await inquirer.prompt([
          {
            type: 'confirm',
            name: 'styleLint',
            message: 'Install StyleLint?',
            default: true,
          },
        ])
      : { styleLint: false };

  const husky = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'husky',
      message: 'Install Husky and Lint-Staged?',
      default: 'React',
    },
  ]);

  return { ...projectType, ...styleLint, ...husky } as {
    [key: string]: string | boolean;
  };
};
