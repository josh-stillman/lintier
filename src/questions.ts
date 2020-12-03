// ask questions if no args

import inquirer from 'inquirer';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const question = async () => {
  const questions = [
    {
      type: 'list',
      name: 'template',
      message: 'Please choose which project template to use',
      choices: ['JavaScript', 'TypeScript'],
      default: 'Typescript',
    },
  ];

  return (inquirer.prompt(questions) as unknown) as {
    [key: string]: boolean | string | undefined;
  };
};
