import { getDepList } from '../installDependencies/installDependencies';

describe('install dependencies', () => {
  test('react', () => {
    const reactDeps = [
      'eslint@latest',
      'prettier@latest',
      '@typescript-eslint/eslint-plugin@latest',
      '@typescript-eslint/parser@latest',
      'eslint-config-prettier@latest',
      'eslint-plugin-prettier@latest',
      'eslint-plugin-react@latest',
      'eslint-plugin-react-hooks@latest',
    ];

    expect(
      getDepList({
        react: true,
        node: false,
        styleLint: false,
        sass: false,
        lintStaged: false,
      })
    ).toEqual(reactDeps);
  });

  test('node', () => {
    const nodeDeps = [
      'eslint@latest',
      'prettier@latest',
      '@typescript-eslint/eslint-plugin@latest',
      '@typescript-eslint/parser@latest',
      'eslint-config-prettier@latest',
      'eslint-plugin-prettier@latest',
      'eslint-plugin-node@latest',
    ];

    expect(
      getDepList({
        react: false,
        node: true,
        styleLint: false,
        sass: false,
        lintStaged: false,
      })
    ).toEqual(nodeDeps);
  });

  test('react + stylelint', () => {
    const stylelintDeps = [
      'eslint@latest',
      'prettier@latest',
      '@typescript-eslint/eslint-plugin@latest',
      '@typescript-eslint/parser@latest',
      'eslint-config-prettier@latest',
      'eslint-plugin-prettier@latest',
      'eslint-plugin-react@latest',
      'eslint-plugin-react-hooks@latest',
      'stylelint@latest',
      'stylelint-config-prettier@latest',
      'stylelint-prettier@latest',
      'stylelint-config-standard@latest',
    ];

    expect(
      getDepList({
        react: true,
        node: false,
        styleLint: true,
        sass: false,
        lintStaged: false,
      })
    ).toEqual(stylelintDeps);
  });

  test('react + stylelint + sass', () => {
    const stylelintDeps = [
      'eslint@latest',
      'prettier@latest',
      '@typescript-eslint/eslint-plugin@latest',
      '@typescript-eslint/parser@latest',
      'eslint-config-prettier@latest',
      'eslint-plugin-prettier@latest',
      'eslint-plugin-react@latest',
      'eslint-plugin-react-hooks@latest',
      'stylelint@latest',
      'stylelint-config-prettier@latest',
      'stylelint-prettier@latest',
      'stylelint-config-standard@latest',
      'stylelint-config-sass-guidelines@latest',
    ];

    expect(
      getDepList({
        react: true,
        node: false,
        styleLint: true,
        sass: true,
        lintStaged: false,
      })
    ).toEqual(stylelintDeps);
  });

  test('all', () => {
    const allDeps = [
      'eslint@latest',
      'prettier@latest',
      '@typescript-eslint/eslint-plugin@latest',
      '@typescript-eslint/parser@latest',
      'eslint-config-prettier@latest',
      'eslint-plugin-prettier@latest',
      'eslint-plugin-node@latest',
      'eslint-plugin-react@latest',
      'eslint-plugin-react-hooks@latest',
      'stylelint@latest',
      'stylelint-config-prettier@latest',
      'stylelint-prettier@latest',
      'stylelint-config-standard@latest',
      'stylelint-config-sass-guidelines@latest',
      'simple-git-hooks@latest',
      'lint-staged@latest',
    ];

    expect(
      getDepList({
        react: true,
        node: true,
        styleLint: true,
        sass: true,
        lintStaged: true,
      })
    ).toEqual(allDeps);
  });
});
