import { getDepList } from '../installDependencies/installDependencies';

describe('install dependencies', () => {
  test('react', () => {
    const reactDeps = [
      'eslint',
      'prettier',
      '@typescript-eslint/eslint-plugin',
      '@typescript-eslint/parser',
      'eslint-config-prettier',
      'eslint-plugin-prettier',
      'eslint-plugin-react',
      'eslint-plugin-react-hooks',
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
      'eslint',
      'prettier',
      '@typescript-eslint/eslint-plugin',
      '@typescript-eslint/parser',
      'eslint-config-prettier',
      'eslint-plugin-prettier',
      'eslint-plugin-node',
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
      'eslint',
      'prettier',
      '@typescript-eslint/eslint-plugin',
      '@typescript-eslint/parser',
      'eslint-config-prettier',
      'eslint-plugin-prettier',
      'eslint-plugin-react',
      'eslint-plugin-react-hooks',
      'stylelint',
      'stylelint-config-prettier',
      'stylelint-prettier',
      'stylelint-config-standard',
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
      'eslint',
      'prettier',
      '@typescript-eslint/eslint-plugin',
      '@typescript-eslint/parser',
      'eslint-config-prettier',
      'eslint-plugin-prettier',
      'eslint-plugin-react',
      'eslint-plugin-react-hooks',
      'stylelint',
      'stylelint-config-prettier',
      'stylelint-prettier',
      'stylelint-config-standard',
      'stylelint-config-sass-guidelines',
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
      'eslint',
      'prettier',
      '@typescript-eslint/eslint-plugin',
      '@typescript-eslint/parser',
      'eslint-config-prettier',
      'eslint-plugin-prettier',
      'eslint-plugin-node',
      'eslint-plugin-react',
      'eslint-plugin-react-hooks',
      'stylelint',
      'stylelint-config-prettier',
      'stylelint-prettier',
      'stylelint-config-standard',
      'stylelint-config-sass-guidelines',
      'simple-git-hooks',
      'lint-staged',
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
