/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import inquirer from 'inquirer';
import { ConfigAnswers, ProjectType, StyleType } from './getOptions';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const askQuestions = async (): Promise<ConfigAnswers> => {
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
      ? (((await inquirer.prompt([
          {
            type: 'confirm',
            name: 'styleLint',
            message: 'Install StyleLint?',
            default: true,
          },
        ])) as unknown) as { styleLint: boolean })
      : { styleLint: false };

  const styleType = styleLint.styleLint
    ? (((await inquirer.prompt([
        {
          type: 'list',
          name: 'styleType',
          message: 'Which styling tools does the project use?',
          choices: ['Styled Components / css-in-js', 'Sass', 'Both', 'Neither'],
          default: 'Styled Components / css-in-js',
        },
      ])) as unknown) as { styleType: StyleType })
    : { styleType: 'Neither' };

  const lintStaged = ((await inquirer.prompt([
    {
      type: 'confirm',
      name: 'lintStaged',
      message: 'Install lint-staged?',
      default: false,
    },
  ])) as unknown) as { lintStaged: boolean };

  return {
    ...projectType,
    ...styleLint,
    ...lintStaged,
    ...styleType,
  } as ConfigAnswers;
};
