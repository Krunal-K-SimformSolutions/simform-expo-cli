import path from 'path';
import { QuestionAnswer } from './questions';
import fs from 'fs';
import {
  TsConfigTemplate,
  PrettierConfigTemplate,
  MetroConfigTemplate,
  PackageTemplate,
  GitIgnoreTemplate,
  EslintConfigTemplate,
  EasConfigTemplate,
  CspellConfigTemplate,
  LeftHookConfigTemplate,
  BabelConfigTemplate,
  AppConfigTemplate
} from '../template';
import { writeJsxToJsonFile, writeJsxToTsFile } from './utils';

export const generateProject = async () => {
  const variables = QuestionAnswer.instance;
  // const isSentry = variables.isSupportFeature('Sentry');
  // const isTranslations = variables.isSupportFeature('Translations');
  const isEsLint = variables.isSupportFeature('EsLint');
  const isPrettier = variables.isSupportFeature('Prettier');
  const isCSpell = variables.isSupportFeature('CSpell');
  const isLeftHook = variables.isSupportFeature('LeftHook');

  const isSupportEAS = variables.getSupportEAS;

  // const isReactRedux = variables.isReactReduxStateManagement;
  // const isReduxSaga = variables.isReduxSagaStateManagementMiddleware;

  // const isAxios = variables.isSupportApiMiddleware('Axios');
  // const isAWSAmplify = variables.isSupportApiMiddleware('AWSAmplify');

  const projectPath = path.join(process.cwd(), variables.getProjectName);

  // Create project directories if they don't exist
  fs.mkdirSync(projectPath, { recursive: true });

  // Create tsconfig.json
  writeJsxToJsonFile(path.join(projectPath, 'tsconfig.json'), TsConfigTemplate());

  if (isPrettier) {
    // Create prettierrc.json
    writeJsxToJsonFile(path.join(projectPath, '.prettierrc.json'), PrettierConfigTemplate());
  }

  // Create package.json
  writeJsxToJsonFile(path.join(projectPath, 'package.json'), PackageTemplate());

  // Create metro.config.js
  writeJsxToTsFile(path.join(projectPath, 'metro.config.js'), MetroConfigTemplate());

  // Create gitignore
  fs.writeFileSync(path.join(projectPath, '.gitignore'), GitIgnoreTemplate().trim());

  if (isEsLint) {
    // Create eslint.config.js
    writeJsxToTsFile(path.join(projectPath, 'eslint.config.js'), EslintConfigTemplate());
  }

  if (isSupportEAS) {
    // Create eas.json
    writeJsxToJsonFile(path.join(projectPath, 'eas.json'), EasConfigTemplate());
  }

  if (isCSpell) {
    // Create cspell.json
    writeJsxToJsonFile(path.join(projectPath, '.cspell.json'), CspellConfigTemplate());
  }

  if (isLeftHook) {
    // Create lefthook.json
    writeJsxToJsonFile(path.join(projectPath, '.lefthook.json'), LeftHookConfigTemplate());
  }

  // Create babel.config.js
  writeJsxToTsFile(path.join(projectPath, 'babel.config.js'), BabelConfigTemplate());

  // Create app.config.js
  writeJsxToTsFile(path.join(projectPath, 'app.config.js'), AppConfigTemplate());

  // const templatePath = path.join(__dirname, '../template');
  console.log(`Your project has been created at ${projectPath}`);
};
