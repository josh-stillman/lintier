import terminalLink from 'terminal-link';

const eslintLink = terminalLink(
  'eslint extension',
  'https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint'
);

const stylelintLink = terminalLink(
  'stylelint extension',
  'https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint'
);

export const successMessage = (
  styleLint: boolean
) => `Successfully installed eslint${
  styleLint ? ' & stylelint' : ''
} & prettier.

Next steps:
1. Edit .rc files to your liking.

2. Install eslint${styleLint ? ' & stylelint' : ''} VS Code plugins:
  • ${eslintLink} ${
  !styleLint
    ? ''
    : `
  • ${stylelintLink}`
}
3. Edit your VS Code settings.json to enable auto-format on save:

  "editor.codeActionsOnSave": {
    "source.fixAll": true
  }"

Lintier out ✌️
`;
