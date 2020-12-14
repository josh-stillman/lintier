/* eslint-disable no-use-before-define */
import { askQuestions } from './askQuestions';
import { getArgs } from './parseArgs';

export interface CommandLineOptions {
  react: boolean | undefined;
  node: boolean | undefined;
  styleLint: boolean | undefined;
  airBnb: boolean | undefined;
  husky: boolean | undefined;
}

export interface LintierConfig {
  projectType: 'React' | 'Node' | 'Both' | 'Neither';
  styleLint: boolean | undefined;
  airBnb: boolean | undefined;
  husky: boolean | undefined;
}

export const getConfig = async () => {
  const clArgs = getArgs() as CommandLineOptions;

  if (Object.values(clArgs).every(opt => opt === undefined)) {
    return askQuestions();
  }

  return transformClArgs(clArgs);
};

export const transformClArgs = (clArgs: CommandLineOptions): LintierConfig => {
  const { react, node, styleLint, husky, airBnb } = clArgs;

  let projectType: LintierConfig['projectType'];

  if (react) {
    projectType = node ? 'Both' : 'React';
  } else {
    projectType = node ? 'Node' : 'Neither';
  }

  return {
    projectType,
    airBnb,
    styleLint,
    husky,
  };
};
