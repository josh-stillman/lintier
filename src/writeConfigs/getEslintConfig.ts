export const getEslintConfig = ({
  node,
  react,
}: {
  node: boolean;
  react: boolean;
}) => `${getImports({
  node,
  react,
})}

export default tseslint.config(
  {
    ignores: ['dist', 'bin', 'build', 'node_modules'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ${react ? 'react.configs.flat.recommended,' : ''}
  eslintPluginPrettierRecommended,

  {
    languageOptions: {
      globals: {
        ${react ? '...globals.browser,' : ''}
        ${node ? '...globals.node,' : ''}
        ...globals.jest,
      },
    },
    plugins: {
      ${react ? 'react,' : ''}
    },
    settings: {
      ${react ? "react: { version: 'detect' }," : ''}
    },
    rules: {
      ${getRules({ node, react }).join('\n      ')}
    },
  }
);
`;

const getImports = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  node,
  react,
}: {
  node: boolean;
  react: boolean;
}) => `// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
${react ? "import react from 'eslint-plugin-react';" : ''}
import globals from 'globals';`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getRules = ({ react, node }: { react: boolean; node: boolean }) => {
  // const baseRules = {
  //   '@typescript-eslint/camelcase': 'off',
  //   '@typescript-eslint/explicit-function-return-type': 'off',
  //   '@typescript-eslint/explicit-module-boundary-types': 'off',
  //   '@typescript-eslint/require-await': 'off',
  //   'no-console': ['error', { allow: ['warn', 'error'] }],
  //   'import/extensions': 'off',
  //   'import/no-extraneous-dependencies': 'off',
  //   'import/no-unresolved': 'off',
  //   'import/prefer-default-export': 'off',
  //   'no-use-before-define': 'off',
  //   'prettier/prettier': 'error',
  // };

  // const nodeRules = node
  //   ? {
  //       'node/no-missing-import': 'off',
  //       'node/no-unsupported-features/es-syntax': 'off',
  //       'node/shebang': 'off',
  //     }
  //   : {};

  const reactRules = react
    ? [
        `'react/react-in-jsx-scope': 0,`,
        // 'react/require-default-props': 'off',
        // 'react/jsx-filename-extension': [1, { extensions: ['.tsx', '.jsx'] }],
        // 'react/ state-in-constructor': 'off',
      ]
    : [];

  return [
    // ...baseRules,
    // ...nodeRules,
    ...reactRules,
  ];
};
