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
const path = require('path');
const { exit } = require('process');
const execa = require('execa');

const getArgs = require('./src/parseArgs').getArgs;
const question = require('./src/questions').question;

const main = async () => {
  // 0. guarding on proper dir and has git
  const hasPackageJson = fs.existsSync(path.join(process.cwd(), 'package.json'));
  const hasGit = fs.existsSync(path.join(process.cwd(), '.git/'));

  if (!hasPackageJson) {
    console.log("Missing package.json in directory.  Exiting");
    exit(1);
  }

  if (!hasGit) {
    console.log("No git detected.");
    // prompt for continue?
    exit(1);
  }

  // 0.A.; setup
  const useYarn = fs.existsSync(path.join(process.cwd(), 'yarn.lock'));

  // 1. get options / ask questions
  const program = getArgs();

  console.log(program.opts());

  let answers;

  if (Object.values(program.opts()).every(opt => opt === undefined)) {
    answers = await question();
  }

  console.log(answers);

  const oldPackageJson = require(path.join(process.cwd(), 'package.json'));
  // const obj = JSON.parse(oldPackageJson, JSON.stringify(oldPackageJson));
  // console.log('package json is', oldPackageJson)

  oldPackageJson.scripts.lint = "hello world"

  const newPkg = JSON.stringify(oldPackageJson, null, 2)
  console.log('new process json', newPkg)
  console.log("has pkg json in dir", hasPackageJson)
  console.log("has git in dir", hasGit)
  console.log("use yarn", useYarn)


  // const subprocess = execa('echo', [newPkg])
  // subprocess.stdout.pipe(fs.createWriteStream('new.json'))

  // const inst = execa('npm', ['install', 'dotenv'], ['-E'])

}

main();
