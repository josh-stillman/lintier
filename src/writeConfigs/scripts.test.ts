import { getLintScripts } from './writeConfigs';

test('lint scripts with stylelint', () => {
  expect(getLintScripts(true)).toEqual({
    lint: 'npm run lint-code ; npm run lint-styles',
    'lint:fix': 'npm run lint-code -- --fix ; npm run lint-styles -- --fix',
    'lint-code': 'eslint .',
    'lint-styles': "stylelint --ignore-path .gitignore '**/*.{css,scss,sass}'",
  });
});
test('lint scripts without stylelint', () => {
  expect(getLintScripts(false)).toEqual({
    lint: 'npm run lint-code',
    'lint:fix': 'npm run lint-code -- --fix',
    'lint-code': 'eslint .',
  });
});
