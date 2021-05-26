import terminalLink from 'terminal-link';

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
) => `Successfully installed eslint${
  styleLint ? ' & stylelint' : ''
} & prettier.

Next steps:
1. Edit .rc files to your liking.

2. Install eslint${styleLint ? ' & stylelint' : ''} VS Code extensions:
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
