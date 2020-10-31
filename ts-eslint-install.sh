#!/usr/bin/env bash

echo "This script will add files and edit your package.json.
IMPORTANT: Make sure you are able to roll back changes with git before proceeding!!
Also, run this script only in the top level directory of your project"

GIT=$(git status | grep "fatal: not a git repository")

if [ ! -z "$GIT" ]; then
  echo "No git repository detected.  Exiting."
  exit 1;
fi

FILE=./package.json
if [ ! -f "$FILE" ]; then
    echo "No package.json detected in directory.  Please run in top level project directory."
    exit 1;
fi

# get rid of this one now.
while true; do
    read -p "Ready to proceed? (y/n) " yn
    case $yn in
        [Yy]* ) echo 'Here we go!'; break;;
        [Nn]* ) echo 'ok peeece'; exit;;
        * ) echo "Please answer yes or no (y/n) ";;
    esac
done



AIRBNB="false"
while true; do
    read -p "Install Airbnb Eslint Config? (y/n) " yn
    case $yn in
        [Yy]* ) echo 'Installing Airbnb!'; AIRBNB="true"; break;;
        [Nn]* ) echo 'Skipping Airbnb'; break;;
        * ) echo "Please answer yes or no (y/n) ";;
    esac
done


INSTALL="npm install"
YARN_LOCK="./yarn.lock"
if [ -f "$YARN_LOCK" ]; then
    echo "yarn.lock detected.  Using yarn to install dependencies"
    INSTALL="yarn add"
fi


$INSTALL eslint prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-config-prettier eslint-plugin-prettier eslint-plugin-react eslint-plugin-react-hooks -E -D

if [ $AIRBNB == "true" ]; then
  npx install-peerdeps --dev -x -E eslint-config-airbnb
fi

PRETTIER_RC="{
  \"bracketSpacing\": true,
  \"printWidth\": 80,
  \"semi\": true,
  \"singleQuote\": true,
  \"tabWidth\": 2,
  \"useTabs\": false,
  \"trailingComma\":\"es5\",
  \"quoteProps\": \"as-needed\",
  \"arrowParens\": \"avoid\"
}"

echo "$PRETTIER_RC" > .prettierrc

AIRBNB_EXTENDS=""
if [ $AIRBNB == "true" ]; then
  AIRBNB_EXTENDS="\"airbnb\",
  "
fi

ESLINT_RC="{
  \"extends\": [
    $AIRBNB_EXTENDS\"eslint:recommended\",
    \"plugin:react/recommended\",
    \"plugin:@typescript-eslint/eslint-recommended\",
    \"plugin:@typescript-eslint/recommended\",
    \"plugin:@typescript-eslint/recommended-requiring-type-checking\",
    \"prettier/@typescript-eslint\",
    \"prettier/react\",
    \"plugin:prettier/recommended\" // must be last in extends array
  ],
  \"env\": {
    \"browser\": true,
    \"node\": true,
    \"es6\": true
  },
  \"parser\": \"@typescript-eslint/parser\",
  \"parserOptions\": {
    \"ecmaVersion\": 2018,
    \"sourceType\": \"module\",
    \"ecmaFeatures\": {
      \"jsx\": true
    },
    \"project\": \"./tsconfig.eslint.json\"
  },
  \"plugins\": [
    \"react-hooks\",
    \"@typescript-eslint\",
    \"prettier\"
  ],
  \"settings\":  {
    \"react\":  {
      \"version\": \"detect\"
    }
  },
  \"rules\": {
    \"prettier/prettier\": \"error\",
    \"@typescript-eslint/explicit-function-return-type\": \"off\",
    \"react/jsx-filename-extension\": [1, { \"extensions\": [\".tsx\", \".jsx\"] }],
    \"@typescript-eslint/camelcase\": \"off\",
    \"@typescript-eslint/no-explicit-any\": \"off\",
    \"import/no-extraneous-dependencies\":\"off\",
    \"import/no-unresolved\": \"off\",
    \"react/state-in-constructor\":\"off\",
    \"import/prefer-default-export\":\"off\",
    \"import/extensions\":\"off\",
    \"@typescript-eslint/require-await\":\"off\"
  }
}"

echo "$ESLINT_RC" > .eslintrc

LINT_SCRIPTS=$(grep \"lint\": package.json)

ADD_SCRIPTS="false"
if [ -z "$LINT_SCRIPTS" ]; then
  while true; do
      read -p "Add lint scripts to package.json? (y/n) " yn
      case $yn in
          [Yy]* ) echo 'Adding lint scripts'; ADD_SCRIPTS="true"; break;;
          [Nn]* ) echo 'Leaving package.json as is'; break;;
          * ) echo "Please answer yes or no (y/n) ";;
      esac
  done
fi

if [ $ADD_SCRIPTS == "true" ]; then
  NEW_PACKAGE_JSON=$(sed '
  /"scripts": {/a\
  \ \ \ \ "lint": "eslint --ext .js,.jsx,.ts,.tsx --ignore-path .gitignore .",\
  \ \ \ \ "lint:fix": "eslint --ext .js,.jsx,.ts,.tsx --ignore-path .gitignore --fix .",
  ' package.json)

  echo "$NEW_PACKAGE_JSON" > package.json
fi

echo "Finished installation.  Next steps:
1. If necessary, upgrade TS, React, react-scripts (create react app), and Node versions to work with linting package versions.
2. Edit rules in .eslintrc & .prettierrc to your liking.
4. Add eslint (and stylelint if installed above) VS Code plugins.
3. Edit your VS Code settings.json to enable auto-format on save:
  "editor.codeActionsOnSave": {
    "source.fixAll": true
  },
"
