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
  AppConfigTemplate,
  MsgCheckerTemplate,
  VsCodeSettingsTemplate,
  ReactNativeSVGTemplate,
  TypesIndexTemplate,
  EnvConfigTemplate,
  RootLayoutTemplate
} from '../template';
import { writeJsxToJsonFile, writeJsxToTsFile, Indicators } from './utils';
import AppConstant from './AppConstant';

export const generateProject = async (spinner: Indicators) => {
  spinner.changeMessage({
    color: 'cyanBright',
    modifiers: 'bold',
    text: AppConstant.StringConstants.msgProjectSetup
  });
  spinner.start();

  const variables = QuestionAnswer.instance;
  // const isSentry = variables.isSupportFeature(AppConstant.AddFeature.Sentry);
  // const isTranslations = variables.isSupportFeature(AppConstant.AddFeature.Translations);
  const isEsLint = variables.isSupportFeature(AppConstant.AddFeature.EsLint);
  const isPrettier = variables.isSupportFeature(AppConstant.AddFeature.Prettier);
  const isCSpell = variables.isSupportFeature(AppConstant.AddFeature.CSpell);
  const isLeftHook = variables.isSupportFeature(AppConstant.AddFeature.LeftHook);

  const isSupportEAS = variables.getSupportEAS;

  // const isReactRedux = variables.isReactReduxStateManagement;
  // const isReduxSaga = variables.isReduxSagaStateManagementMiddleware;

  // const isAxios = variables.isSupportApiMiddleware(AppConstant.ApiMiddleware.Axios);
  // const isAWSAmplify = variables.isSupportApiMiddleware(AppConstant.ApiMiddleware.AWSAmplify);

  spinner.changeMessage({
    color: 'greenBright',
    modifiers: 'bold',
    text: AppConstant.StringConstants.msgProjectDirectories
  });
  const projectPath = path.join(process.cwd(), variables.getProjectName);

  // Create project directories if they don't exist
  fs.mkdirSync(projectPath, { recursive: true });

  // Create tsconfig.json
  await writeJsxToJsonFile(path.join(projectPath, 'tsconfig.json'), TsConfigTemplate());

  // Create package.json
  await writeJsxToJsonFile(path.join(projectPath, 'package.json'), PackageTemplate());

  // Create metro.config.js
  await writeJsxToTsFile(path.join(projectPath, 'metro.config.js'), MetroConfigTemplate());

  // Create gitignore
  fs.writeFileSync(path.join(projectPath, '.gitignore'), GitIgnoreTemplate().trim());

  spinner.changeMessage({
    color: 'magentaBright',
    modifiers: 'bold',
    text: AppConstant.StringConstants.msgStaticCodeAnalysis
  });

  if (isPrettier) {
    // Create prettierrc.json
    await writeJsxToJsonFile(path.join(projectPath, '.prettierrc.json'), PrettierConfigTemplate());
  }

  if (isEsLint) {
    // Create eslint.config.js
    await writeJsxToTsFile(path.join(projectPath, 'eslint.config.js'), EslintConfigTemplate());
  }

  if (isCSpell) {
    // Create cspell.json
    await writeJsxToJsonFile(path.join(projectPath, '.cspell.json'), CspellConfigTemplate());
  }

  if (isLeftHook) {
    // Create lefthook.json
    await writeJsxToJsonFile(path.join(projectPath, '.lefthook.json'), LeftHookConfigTemplate());

    // Create .lefthook/commit-msg/msg_checker.sh
    const lefthookPath = path.join(projectPath, '.lefthook', 'commit-msg');
    fs.mkdirSync(lefthookPath, { recursive: true });
    fs.writeFileSync(path.join(lefthookPath, 'msg_checker.sh'), MsgCheckerTemplate().trim());
  }

  // Create .vscode/settings.json
  const vsCodePath = path.join(projectPath, '.vscode');
  fs.mkdirSync(vsCodePath, { recursive: true });
  await writeJsxToJsonFile(path.join(vsCodePath, 'settings.json'), VsCodeSettingsTemplate().trim());

  spinner.changeMessage({
    color: 'yellowBright',
    modifiers: 'bold',
    text: AppConstant.StringConstants.msgProjectEnvironmentSetup
  });

  if (isSupportEAS) {
    // Create eas.json
    await writeJsxToJsonFile(path.join(projectPath, 'eas.json'), EasConfigTemplate());
  }

  // Create babel.config.js
  await writeJsxToTsFile(path.join(projectPath, 'babel.config.js'), BabelConfigTemplate());

  // Create app.config.js
  await writeJsxToTsFile(path.join(projectPath, 'app.config.js'), AppConfigTemplate());

  // Create .env
  for (const env of variables.getSetupEnv) {
    if (variables.isSupportProductionEnv(env)) {
      fs.writeFileSync(path.join(projectPath, '.env'), EnvConfigTemplate(env).trim());
    } else {
      fs.writeFileSync(path.join(projectPath, `.env.${env}`), EnvConfigTemplate(env).trim());
    }
  }

  spinner.changeMessage({
    color: 'blueBright',
    modifiers: 'bold',
    text: AppConstant.StringConstants.msgProjectFiles
  });

  // Create @types/ReactNativeSVG.d.ts
  const typesPath = path.join(projectPath, '@types');
  fs.mkdirSync(typesPath, { recursive: true });
  await writeJsxToTsFile(path.join(typesPath, 'ReactNativeSVG.d.ts'), ReactNativeSVGTemplate());
  await writeJsxToTsFile(path.join(typesPath, 'index.d.ts'), TypesIndexTemplate());

  // Create app/_layout.tsx
  const appPath = path.join(projectPath, 'app');
  fs.mkdirSync(appPath, { recursive: true });
  await writeJsxToTsFile(path.join(appPath, '_layout.tsx'), RootLayoutTemplate());
};
