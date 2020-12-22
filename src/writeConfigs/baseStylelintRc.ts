// suggested linting setup from styled-components docs not working for me as of 12/21/20
// leaving code commented for now

export const getBaseStylelintRc = ({
  // styledComponents,
  sass,
}: {
  // styledComponents: boolean;
  sass: boolean;
}) => {
  // const styledComponentsPlugins = ['stylelint-config-styled-components'];
  const sassPlugins = ['stylelint-config-sass-guidelines'];

  return {
    // ...(styledComponents
    //   ? { processors: ['stylelint-processor-styled-components'] }
    //   : {}),
    extends: [
      'stylelint-config-standard',
      // ...(styledComponents ? styledComponentsPlugins : []),
      ...(sass ? sassPlugins : []),
      'stylelint-prettier/recommended',
    ],
  };
};
