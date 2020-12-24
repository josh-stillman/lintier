/* eslint-disable no-use-before-define */
import { askQuestions } from './askQuestions';
import { getArgs } from './parseArgs';

export interface LintierConfig {
  [key: string]: boolean;
  react: boolean;
  node: boolean;
  styleLint: boolean;
  styledComponents: boolean;
  sass: boolean;
  airBnb: boolean;
  husky: boolean;
}

export type CommandLineOptions = Partial<LintierConfig>;

export type ProjectType = 'React' | 'Node' | 'Both' | 'Neither';
export type StyleType =
  | 'Styled Components  / css-in-js'
  | 'Sass'
  | 'Both'
  | 'Neither';

export interface ConfigAnswers {
  projectType: ProjectType;
  styleLint: boolean;
  styleType: StyleType;
  airBnb: boolean;
  husky: boolean;
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
  const { projectType, styleLint, styleType, airBnb, husky } = answers;

  return {
    react: projectType === 'React' || projectType === 'Both',
    node: projectType === 'Node' || projectType === 'Both',
    styleLint,
    styledComponents:
      styleType === 'Styled Components  / css-in-js' || styleType === 'Both',
    sass: styleType === 'Sass' || styleType === 'Both',
    airBnb,
    husky,
  };
};

export const transformClArgs = (clArgs: CommandLineOptions): LintierConfig => {
  const transformedClArgs: CommandLineOptions = { ...clArgs };

  Object.keys(transformedClArgs).forEach(k => {
    transformedClArgs[k] = !!transformedClArgs[k];
  });

  return transformedClArgs as LintierConfig;
};
