/* eslint-disable node/no-unpublished-require */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable node/no-missing-require */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import fs from 'fs';
import path from 'path';
import execa from 'execa';

jest.setTimeout(2 * 60 * 1000);

describe('test configs', () => {
  test('configs were written', () => {
    const eslintExists = fs.existsSync(path.join(process.cwd(), '.eslintrc'));

    const prettierExists = fs.existsSync(
      path.join(process.cwd(), '.prettierrc')
    );

    const eslintTsconfigExists = fs.existsSync(
      path.join(process.cwd(), 'tsconfig.eslint.json')
    );

    const stylelintExists = fs.existsSync(
      path.join(process.cwd(), '.stylelintrc')
    );

    const lintStagedExists = fs.existsSync(
      path.join(process.cwd(), 'lint-staged-config.js')
    );

    expect(eslintExists).toBeTruthy();
    expect(prettierExists).toBeTruthy();
    expect(stylelintExists).toBeTruthy();
    expect(eslintTsconfigExists).toBeTruthy();
    expect(lintStagedExists).toBeTruthy();
  });
});

describe('test package.json', () => {
  test('dependencies were installed', () => {
    const { devDependencies } = require('../../package.json');

    expect(devDependencies['@typescript-eslint/eslint-plugin']).toBeDefined();
    expect(devDependencies['@typescript-eslint/parser']).toBeDefined();
    expect(devDependencies.eslint).toBeDefined();
    expect(devDependencies['eslint-config-airbnb-typescript']).toBeDefined();
    expect(devDependencies['eslint-config-prettier']).toBeDefined();
    expect(devDependencies['eslint-plugin-import']).toBeDefined();
    expect(devDependencies['eslint-plugin-jsx-a11y']).toBeDefined();
    expect(devDependencies['eslint-plugin-node']).toBeDefined();
    expect(devDependencies['eslint-plugin-prettier']).toBeDefined();
    expect(devDependencies['eslint-plugin-react']).toBeDefined();
    expect(devDependencies['eslint-plugin-react-hooks']).toBeDefined();
    expect(devDependencies['lint-staged']).toBeDefined();
    expect(devDependencies.prettier).toBeDefined();
    expect(devDependencies['simple-git-hooks']).toBeDefined();
    expect(devDependencies.stylelint).toBeDefined();
    expect(devDependencies['stylelint-config-prettier']).toBeDefined();
    expect(devDependencies['stylelint-config-sass-guidelines']).toBeDefined();
    expect(devDependencies['stylelint-config-standard']).toBeDefined();
    expect(devDependencies['stylelint-prettier']).toBeDefined();
  });

  test('lint scripts were added', () => {
    const { scripts } = require('../../package.json');
    expect(scripts.lint).toEqual(
      "eslint --ext .js,.jsx,.ts,.tsx --ignore-path .gitignore . && stylelint --ignore-path .gitignore '**/*.{css,scss,sass,js,ts,jsx,tsx}'"
    );
    expect(scripts['lint:fix']).toEqual(
      "eslint --ext .js,.jsx,.ts,.tsx --ignore-path .gitignore . --fix && stylelint --ignore-path .gitignore '**/*.{css,scss,sass,js,ts,jsx,tsx}' --fix"
    );
  });

  test('git hooks were added', () => {
    const pkgJson = require('../../package.json');

    expect(pkgJson['simple-git-hooks']['pre-commit']).toEqual(
      'npx lint-staged'
    );
  });
});

describe('test eslint', () => {
  test('eslint and eslint --fix work', async () => {
    const filePath = './src/badfile.ts';

    // 1. Lint badfile, expect prettier and eslint errors

    const initialLint = await execa('npx', ['eslint', filePath]).catch(
      e => e.message
    );

    expect(initialLint).toMatch(/prettier\/prettier/);

    expect(initialLint).toMatch(/eqeqeq/);

    // 2. Run lint:fix on badfile

    await execa('npx', ['eslint', filePath, '--fix']);

    // 3. Re-lint badfile, expect no errors

    const { exitCode } = await execa('npx', ['eslint', filePath]).catch(e => e);

    expect(exitCode).toEqual(0);
  });
});

describe('test stylelint', () => {
  test('stylelint and stylelint --fix work', async () => {
    const filePath = './src/badcss.css';

    // 1. Lint badfile, expect prettier errors

    const initialLint = await execa('npx', ['stylelint', filePath]).catch(
      e => e.message
    );

    expect(initialLint).toMatch(/prettier\/prettier/);

    // 2. Run lint:fix on badfile

    await execa('npx', ['stylelint', filePath, '--fix']);

    // 3. Re-lint badfile, expect no errors

    const { exitCode } = await execa('npx', ['stylelint', filePath]).catch(
      e => e
    );

    expect(exitCode).toEqual(0);
  });
});
