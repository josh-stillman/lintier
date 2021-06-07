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
${chalk.bgGray('1.')} Edit .rc files to your liking.

${chalk.bgGray('2.')} Install eslint${
  styleLint ? ' & stylelint' : ''
} VS Code extensions:
  • ${eslintLink} ${
  !styleLint
    ? ''
    : `
  • ${stylelintLink}`
}

${chalk.bgGray(
  '3.'
)} Edit your VS Code settings.json to enable auto-format on save:

${chalk.bgGray(`  "editor.codeActionsOnSave": {
    "source.fixAll": true
  }"`)}

${chalk.cyanBright.italic.underline('Lintier out ✌️')}
`;
