# Deployment Instructions

1. Create PR with updates.
2. On feature branch, run `npm version` to bump and create tag. `npm version major | minor | patch`
3. Commit.  Push the commit and tags. `git push --follow-tags`.
4. Merge PR to main.
4. Create GH release for that tag in GitHub UI.
5. Github action is triggered to build and publish.

See:
1. https://docs.github.com/en/actions/publishing-packages/publishing-nodejs-packages
2. https://docs.npmjs.com/cli/v8/commands/npm-version


