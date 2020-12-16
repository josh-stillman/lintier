export const getEslintRc = ({
  node,
  react,
  airbnb,
}: {
  node: boolean;
  react: boolean;
  airbnb: boolean;
}) => ({
  extends: getExtends({ react, node, airbnb }),
  env: getEnv({ react, node }),
  parser: '@typescript-eslint/parser',
  parserOptions: getParserOptions(react),
  plugins: getPlugins(react),
  settings: getSettings(react),
  rules: getRules({ node, react }),
});

const getExtends = ({
  react,
  node,
  airbnb,
}: {
  react: boolean;
  node: boolean;
  airbnb: boolean;
}) => [
  ...(airbnb ? [`airbnb${react ? '' : '-base'}`] : []),
  'eslint:recommended',
  ...(node ? ['plugin:node/recommended'] : []),
  ...(react ? ['plugin:react/recommended'] : []),
  'plugin:@typescript-eslint/eslint-recommended',
  'plugin:@typescript-eslint/recommended',
  'plugin:@typescript-eslint/recommended-requiring-type-checking',
  'prettier/@typescript-eslint',
  ...(react ? ['prettier/react'] : []),
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
  project: './tsconfig.json',
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
  const baseRules = {
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/require-await': 'off',
    'import/extensions': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/no-unresolved': 'off',
    'import/prefer-default-export': 'off',
    'no-use-before-define': 'off',
    'prettier/prettier': 'error',
  };

  const nodeRules = node
    ? {
        'node/no-missing-import': 'off',
        'node/no-unsupported-features/es-syntax': 'off',
        'node/shebang': 'off',
      }
    : {};

  const reactRules = react
    ? {
        'react/jsx-filename-extension': [1, { extensions: ['.tsx', '.jsx'] }],
        'react/state-in-constructor': 'off',
      }
    : {};

  return {
    ...baseRules,
    ...nodeRules,
    ...reactRules,
  };
};
