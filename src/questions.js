// ask questions if no args

const inquirer = require('inquirer');

const question = async () => {

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

exports.question = question;
