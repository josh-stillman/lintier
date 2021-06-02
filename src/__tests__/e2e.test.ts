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

    expect(eslintExists).toBeTruthy();
    expect(prettierExists).toBeTruthy();
    expect(eslintTsconfigExists).toBeTruthy();
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
