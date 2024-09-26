export const getBaseStylelintRc = ({ sass }: { sass: boolean }) => {
  const sassPlugins = ['stylelint-config-sass-guidelines'];

  return {
    extends: [
      'stylelint-config-standard',
      ...(sass ? sassPlugins : []),
      'stylelint-prettier/recommended',
    ],
  };
};
