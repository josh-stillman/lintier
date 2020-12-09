/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import inquirer from 'inquirer';
import { LintierConfig } from './getConfig';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const askQuestions = async (): Promise<LintierConfig> => {
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
      name: 'airBnb',
      message: 'Install AirBnb Style Guide Config?',
      default: true,
    },
  ])) as unknown) as {
    projectType: ProjectType;
    airBnb: boolean;
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

  return { ...projectType, ...styleLint, ...husky } as LintierConfig;
};
