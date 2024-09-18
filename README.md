# Lintier

![E2E Test Status](https://github.com/josh-stillman/lintier/actions/workflows/e2e.yml/badge.svg) [![Version](https://img.shields.io/npm/v/lintier.svg?style=flat-square)](https://www.npmjs.com/package/lintier?activeTab=versions) [![Downloads](https://img.shields.io/npm/dt/lintier.svg?style=flat-square)](https://www.npmjs.com/package/lintier) [![Last commit](https://img.shields.io/github/last-commit/josh-stillman/lintier.svg?style=flat-square)](https://github.com/josh-stillman/lintier/graphs/commit-activity)

### Lintier is a CLI to quickly scaffold an [ESLint](https://eslint.org/) & [Prettier](https://prettier.io/) setup in a [TypeScript](https://www.typescriptlang.org/) project.  Because linting and code formatting are a must, but setup is a pain.

![](https://github.com/josh-stillman/lintier/blob/main/lintier.gif?raw=true)

Lintier works in React, Node, and vanilla Typescript projects. It provides options to install [stylelint](https://stylelint.io/) for linting styles, and [lint-staged](https://github.com/okonet/lint-staged#readme) for linting pre-commit. Lintier will install the dependencies, create the config files, and add linting scripts to your `package.json` file.

Lintier's goal is to provide a minimal setup to build upon.  You should modify the config files to fit your project's needs.

## Update for ESLint 9

As of Fall 2024, the community is still updating various packages to be compatible with ESLint version 9. This version of lintier disables currently incompatible packages like [eslint-plugin-react-hooks](https://github.com/facebook/react/issues/28313), [eslint-plugin-node](https://github.com/mysticatea/eslint-plugin-node), and the [airbnb styleguide](https://github.com/airbnb/javascript/issues/2961).

## Usage

Just run `npx lintier` in your project's directory.  Linter will start in interactive mode, letting you choose your project type and configuration.

Alternately, you can specify any of the options below to skip the interactive prompts:

  |Options                 |Description
  -------------------------|-------------------------
  |-r, --react             |install react dependencies
  |-n, --node              |install node dependencies
  |-s, --styleLint         |install stylelint
  |-p, --sass              |install sass stylelint config & lint script
  |-l, --lintStaged        |install lint-staged and simple-git-hooks
  |--help                  |display help for command
  |-V, --version           |output the version number


## Troubleshooting

Lintier installs the latest version of the various dependencies, and versions are not pinned.  This helps me keep the package up-to-date as I use it, but it also means breaking changes in those dependencies can break lintier.  A weekly scheduled end-to-end test is also setup to help catch these changes.

If you spot trouble, please open an issue in the GitHub repo.

## Contributing

Pull requests are welcome!  The goal is to keep lintier minimalist, so please minimize any additional rules enabled and options presented to the user.

