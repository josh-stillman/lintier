// ask questions if no args

import inquirer from 'inquirer';

export const question = async () => {

  const questions = [
    {
      type: 'list',
      name: 'template',
      message: 'Please choose which project template to use',
      choices: ['JavaScript', 'TypeScript'],
      default: 'Typescript',
    }
  ];

  const answers = await inquirer.prompt(questions);

  return answers;
}
