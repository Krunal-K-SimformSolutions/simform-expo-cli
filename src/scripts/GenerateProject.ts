import path from 'path';
import fs from 'fs-extra';
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
  MainIndexTemplate
} from '../../template/index.js';
import { AppConstant, getTheme } from '../constants/index.js';
import { QuestionAnswer } from '../questions/index.js';
import { writeJsxToJsonFile, writeJsxToTsFile, showError } from '../utils/index.js';
import type { Indicators } from '../utils/index.js';

/**
 *
 */
export const generateProject = async (projectPath: string, spinner: Indicators) => {
  const colors = getTheme();

  try {
    const variables = QuestionAnswer.instance;

    const isEsLint = variables.isSupportFeature(AppConstant.AddFeature.EsLint);
    const isPrettier = variables.isSupportFeature(AppConstant.AddFeature.Prettier);
    const isCSpell = variables.isSupportFeature(AppConstant.AddFeature.CSpell);
    const isLeftHook = variables.isSupportFeature(AppConstant.AddFeature.LeftHook);

    const isSupportEAS = variables.getSupportEAS;

    // Create index.js
    await writeJsxToTsFile(path.join(projectPath, 'index.js'), MainIndexTemplate());

    // Create tsconfig.json
    await writeJsxToJsonFile(path.join(projectPath, 'tsconfig.json'), TsConfigTemplate());

    // Create package.json
    await writeJsxToJsonFile(path.join(projectPath, 'package.json'), PackageTemplate());

    // Create metro.config.js
    await writeJsxToTsFile(path.join(projectPath, 'metro.config.js'), MetroConfigTemplate());

    // Create gitignore
    await fs.writeFile(path.join(projectPath, '.gitignore'), GitIgnoreTemplate().trim());

    if (isPrettier) {
      // Create prettierrc.json
      await writeJsxToJsonFile(
        path.join(projectPath, '.prettierrc.json'),
        PrettierConfigTemplate()
      );
    }

    if (isEsLint) {
      // Create eslint.config.js
      await writeJsxToTsFile(path.join(projectPath, 'eslint.config.mjs'), EslintConfigTemplate());
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
      await fs.mkdir(lefthookPath, { recursive: true });
      await fs.writeFile(path.join(lefthookPath, 'msg_checker.sh'), MsgCheckerTemplate().trim());
    }

    // Create .vscode/settings.json
    const vsCodePath = path.join(projectPath, '.vscode');
    await fs.mkdir(vsCodePath, { recursive: true });
    await writeJsxToJsonFile(
      path.join(vsCodePath, 'settings.json'),
      VsCodeSettingsTemplate().trim()
    );

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
      // @ts-expect-error : ignore
      if (variables.isSupportProductionEnv(env)) {
        await fs.writeFile(path.join(projectPath, '.env'), EnvConfigTemplate(env).trim());
      } else {
        await fs.writeFile(path.join(projectPath, `.env.${env}`), EnvConfigTemplate(env).trim());
      }
    }

    // Create @types/ReactNativeSVG.d.ts
    const typesPath = path.join(projectPath, '@types');
    await fs.mkdir(typesPath, { recursive: true });
    await writeJsxToTsFile(path.join(typesPath, 'ReactNativeSVG.d.ts'), ReactNativeSVGTemplate());
    await writeJsxToTsFile(path.join(typesPath, 'index.d.ts'), TypesIndexTemplate());
  } catch (error) {
    showError(error, spinner, colors);
  }
};
