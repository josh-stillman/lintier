import fs from 'fs';
import path from 'path';

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
