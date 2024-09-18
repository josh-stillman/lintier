// TODO: remove and update this file
const getEslintRc = ({
  node,
  react,
  airBnb,
}: {
  node: boolean;
  react: boolean;
  airBnb: boolean;
}) => ({
  extends: getExtends({ react, node, airBnb }),
  env: getEnv({ react, node }),
  parser: '@typescript-eslint/parser',
  parserOptions: getParserOptions(react),
  plugins: getPlugins(react),
  settings: getSettings(react),
  rules: getRules({ node, react }),
});

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
    ignores: ['dist', 'build', 'node_modules'],
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
      ${react ? "react: { version: 'detect' }" : ''},
    },
    rules: ${JSON.stringify(getRules({ node, react }), null, 2)},
  });
`;

const getImports = ({
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

const getExtends = ({
  react,
  node,
  airBnb,
}: {
  react: boolean;
  node: boolean;
  airBnb: boolean;
}) => [
  ...(airBnb ? [`airbnb${react ? '' : '-base'}`] : []),
  'eslint:recommended',
  ...(node ? ['plugin:node/recommended'] : []),
  ...(react ? ['plugin:react/recommended'] : []),
  'plugin:@typescript-eslint/eslint-recommended',
  'plugin:@typescript-eslint/recommended',
  'plugin:@typescript-eslint/recommended-requiring-type-checking',
  'prettier',
  'plugin:prettier/recommended', // must be last in array
];

const getEnv = ({ react, node }: { react: boolean; node: boolean }) => ({
  ...(react ? { browser: true } : {}),
  ...(node ? { node: true } : {}),
  es2020: true,
});

const getParserOptions = (react: boolean) => ({
  ...(react
    ? {
        ecmaFeatures: {
          jsx: true,
        },
      }
    : {}),
  sourceType: 'module',
});

const getPlugins = (react: boolean) => [
  ...(react ? ['react-hooks'] : []),
  '@typescript-eslint',
  'prettier',
];

const getSettings = (react: boolean) =>
  react
    ? {
        react: {
          version: 'detect',
        },
      }
    : {};

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

  const nodeRules = node
    ? {
        'node/no-missing-import': 'off',
        'node/no-unsupported-features/es-syntax': 'off',
        'node/shebang': 'off',
      }
    : {};

  const reactRules = react
    ? {
        'react/react-in-jsx-scope': 0,
        // 'react/require-default-props': 'off',
        // 'react/jsx-filename-extension': [1, { extensions: ['.tsx', '.jsx'] }],
        // 'react/ state-in-constructor': 'off',
      }
    : {};

  return {
    // ...baseRules,
    ...nodeRules,
    ...reactRules,
  };
};
