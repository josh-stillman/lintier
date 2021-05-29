# Lintier

Lintier is a script to quickly and easily scaffold an eslint/prettier/stylelint setup in a TypeScript project.  Because linting and code formatting are essential in every project, but setup is a pain.

Lintier works in React, Node, and/or vanilla Typescript projects. It provides an option to install the popular airbnb styleguide, as well as specify a stylelint config.

Lintier will install the necessary dependencies for your project type, create the required .rc files, and add relevant linting scripts to your `package.json` file.

Lintier's goal is to provide a minimal setup from which to build on.  A few rules are included by default as a point of personal privilege, but you should modify the .rc files created to fit your project's needs.

## Usage

Lintier is best used with `npx`. Just run `npx lintier` in your project's directory.  Linter will start in interactive mode if no options are provided, allowing you to specify your project type and configuration.

Alternately, you can specify the options below to skip the interactive prompts:

  |Options                 |Description
  -------------------------|-------------------------
  |-r, --react             |install react dependencies
  |-n, --node              |install node dependencies
  |-a, --airBnb            |install airbnb styleguide
  |-s, --styleLint         |install stylelint
  |-c, --styledComponents  |install styled-components lint script
  |-p, --sass              |install sass stylelint config & lint script
  |-l, --lintStaged        |install lint-staged and simple-git-hooks
  |--help                  |display help for command
  |-V, --version           |output the version number

### A Note on Styled-Components

The styled-components option just adds .ts/.js files to the package.json script to lint styles.  The stylelint config mentioned in the [styled-components docs](https://styled-components.com/docs/tooling#stylelint) seems to conflict with eslint, so I left it out for now.

## Contributing

Pull requests are welcome!  The goal is to keep lintier minimalist, so please minimize any additional rules enabled in the .rc files and options presented to the user.

