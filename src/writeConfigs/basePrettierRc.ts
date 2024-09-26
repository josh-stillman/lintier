export const basePrettierRc = {
  arrowParens: 'avoid' as const, // override
  bracketSpacing: true, // default
  printWidth: 80, // default
  quoteProps: 'as-needed' as const, // default
  semi: true, // default
  singleQuote: true, // override
  tabWidth: 2, // default
  trailingComma: 'es5' as const, // override
  useTabs: false, // default
};

// same as lintier's project .prettierrc
