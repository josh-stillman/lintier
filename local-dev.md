1. Create a test repo with vite starter (`npm create vite@latest -- --template react-ts`) or similar as a sibling directory.
2. Run `npm run build` to compile ts in this directory.
3. In the test repo directory, init git and commit.
4. To test lintier, run `node ../lintier/bin/index.js` to execute, then run `npm run lint` in the test directory.
5. Roll back your changes with git to reset the test dir.
