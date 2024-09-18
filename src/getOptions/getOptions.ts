import { askQuestions } from './askQuestions';
import { getArgs } from './parseArgs';

export interface LintierConfig {
  [key: string]: boolean;
  react: boolean;
  node: boolean;
  styleLint: boolean;
  sass: boolean;
  // airBnb: boolean;
  lintStaged: boolean;
}

export type CommandLineOptions = Partial<LintierConfig>;

export type ProjectType = 'React' | 'Node' | 'Both' | 'Neither';

export interface ConfigAnswers {
  projectType: ProjectType;
  styleLint: boolean;
  sass: boolean;
  // airBnb: boolean;
  lintStaged: boolean;
}

export const getConfig = async () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { version, ...clArgs } = getArgs() as CommandLineOptions;

  if (Object.values(clArgs).every(opt => opt === undefined)) {
    const answers = await askQuestions();
    return transformAnswers(answers);
  }

  return transformClArgs(clArgs);
};

export const transformAnswers = (answers: ConfigAnswers): LintierConfig => {
  const {
    projectType,
    styleLint,
    sass,
    /* airBnb, */
    lintStaged,
  } = answers;

  return {
    react: projectType === 'React' || projectType === 'Both',
    node: projectType === 'Node' || projectType === 'Both',
    styleLint,
    sass,
    // airBnb,
    lintStaged,
  };
};

export const transformClArgs = (clArgs: CommandLineOptions): LintierConfig => {
  const transformedClArgs: CommandLineOptions = { ...clArgs };

  Object.keys(transformedClArgs).forEach(k => {
    transformedClArgs[k] = !!transformedClArgs[k];
  });

  return transformedClArgs as LintierConfig;
};
