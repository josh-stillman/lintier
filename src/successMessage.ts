import terminalLink from 'terminal-link';
import chalk from 'chalk';

const eslintLink = terminalLink(
  'eslint',
  'https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint'
);

const stylelintLink = terminalLink(
  'stylelint',
  'https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint'
);

export const successMessage = (
  styleLint: boolean
) => `${chalk.underline.italic.greenBright(
  `Successfully installed eslint${styleLint ? ' & stylelint' : ''} & prettier.`
)}

${chalk.italic('Next steps:')}
${chalk.italic.red('1.')} Edit config files to your liking.

${chalk.italic.red('2.')} Install eslint${
  styleLint ? ' & stylelint' : ''
} VS Code extensions:
  • ${eslintLink} ${
  !styleLint
    ? ''
    : `
  • ${stylelintLink}`
}

${chalk.italic.red(
  '3.'
)} Edit your VS Code settings.json to enable auto-format on save:

${chalk.gray(`  "editor.codeActionsOnSave": {
    "source.fixAll": "explicit"
  }"`)}

${chalk.cyanBright.italic.underline('Lintier out ✌️')}
`;
