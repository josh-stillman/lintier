#! /usr/bin/env node

// 1. parse cli options
// 2. if none, prompt interactively

// 1. install eslint deps
// 2. write prettierRC
// 3. write eslint (per options)
// 4. add lint scripts to package.json
// 5. add stylelint deps
// 6. add stylelintrc
// 7. add husky and lint-staged

const fs = require('fs');
const { exit } = require('process');
const execa = require('execa');

const hasPackageJson = fs.existsSync('./package.json');
const hasGit = fs.existsSync('./.git/');
const useYarn = fs.existsSync('./yarn.lock');


if (!hasPackageJson) {
  console.log("Missing package.json in directory.  Exiting");
  exit(1);
}

if (!hasGit) {
  console.log("No git detected.");
  // prompt for continue?
  exit(1);
}

const oldPackageJson = require('./package.json');
// const obj = JSON.parse(oldPackageJson, JSON.stringify(oldPackageJson));
console.log('package json is', oldPackageJson)

oldPackageJson.scripts.lint = "hello world"

const newPkg = JSON.stringify(oldPackageJson, null, 2)

console.log("has pkg json in dir", hasPackageJson)
console.log("has git in dir", hasGit)
console.log("use yarn", useYarn)


const subprocess = execa('echo', [newPkg])
subprocess.stdout.pipe(fs.createWriteStream('new.json'))
