# Lintier

![E2E Test Status](https://github.com/josh-stillman/lintier/actions/workflows/e2e.yml/badge.svg) [![Version](https://img.shields.io/npm/v/lintier.svg?style=flat-square)](https://www.npmjs.com/package/lintier?activeTab=versions) [![Downloads](https://img.shields.io/npm/dt/lintier.svg?style=flat-square)](https://www.npmjs.com/package/lintier) [![Last commit](https://img.shields.io/github/last-commit/josh-stillman/lintier.svg?style=flat-square)](https://github.com/josh-stillman/lintier/graphs/commit-activity)

### CLI to quickly setup [ESLint](https://eslint.org/) & [Prettier](https://prettier.io/) in [TypeScript](https://www.typescriptlang.org/) projects.  Because linting and formatting are a must, but setup is a pain.

![](https://github.com/josh-stillman/lintier/blob/main/lintier.gif?raw=true)

Lintier works in React, Node, and other Typescript projects. It lets you install [stylelint](https://stylelint.io/) for linting & formatting css, and [lint-staged](https://github.com/okonet/lint-staged#readme) for linting pre-commit. Lintier will install the dependencies, create the config files, and add scripts to your `package.json` file.

Lintier's goal is to provide a minimal foundation, letting you further customize the setup to fit your project's needs.

## Update for ESLint 9

As of Fall 2024, the community is still updating various packages to be compatible with ESLint 9. This version of lintier disables currently incompatible packages like [eslint-plugin-react-hooks](https://github.com/facebook/react/issues/28313) and the [airbnb styleguide](https://github.com/airbnb/javascript/issues/2961).

## Usage

Just run `npx lintier@latest` in your project's directory.  Linter will start in interactive mode, letting you choose your project type and configuration.

Alternately, you can specify any of these options to skip the interactive prompts:

  |Options                 |Description
  -------------------------|-------------------------
  |-r, --react             |install react dependencies
  |-n, --node              |install node dependencies
  |-s, --styleLint         |install stylelint
  |-c, --sass              |install sass stylelint config
  |-l, --lintStaged        |install lint-staged and simple-git-hooks
  |-p, --pinned            |use pinned dependency versions that are known to work
  |--help                  |display help for command
  |-V, --version           |output the version number


## Troubleshooting and Pinned Versions

By default, lintier installs the latest dependency versions, which means that breaking changes in those dependencies can break lintier.  A weekly automated end-to-end test helps catch these changes.

If the latest dependency versions aren't working, you can fall back to the last-known working versions by passing the `-p` flag.  (Interactive mode still starts if this is the only flag passed).  The [list](./src/installDependencies/pinnedVersions.json) of known working versions is updated after each successful weekly test run.

If you spot trouble, please open an issue in the GitHub repo.
