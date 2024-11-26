import path from 'path';
import fs from 'fs-extra';
import {
  APIUtilsTemplate,
  LoggerUtilsTemplate,
  AsyncStorageUtilsTemplate,
  NavigatorUtilsTemplate,
  StringUtilsTemplate,
  UtilTemplate,
  ValidationSchemaUtilsTemplate,
  NetworkUtilsTemplate,
  SessionUtilsTemplate
} from '../../template/index.js';
import { AppConstant, getTheme } from '../constants/index.js';
import { QuestionAnswer } from '../questions/index.js';
import { showError, writeJsxToTsFile } from '../utils/index.js';
import type { Indicators } from '../utils/index.js';

/**
 *
 */
export const generateUtils = async (appPath: string, spinner: Indicators) => {
  const colors = getTheme();

  try {
    const variables = QuestionAnswer.instance;

    const isAxios = variables.isSupportApiMiddleware(AppConstant.ApiMiddleware.Axios);
    const isAWSAmplify = variables.isSupportApiMiddleware(AppConstant.ApiMiddleware.AWSAmplify);
    const isFetch = variables.isSupportApiMiddleware(AppConstant.ApiMiddleware.Fetch);

    // Create utils directory if it doesn't exist
    const utilsPath = path.join(appPath, 'utils');
    await fs.mkdir(utilsPath, { recursive: true });

    if (isAxios || isAWSAmplify || isFetch) {
      // Create utils APIUtils.ts file
      await writeJsxToTsFile(path.join(utilsPath, 'APIUtils.ts'), APIUtilsTemplate());
    }

    // Create utils LoggerUtils.ts file
    await writeJsxToTsFile(path.join(utilsPath, 'LoggerUtils.ts'), LoggerUtilsTemplate());

    // Create utils AsyncStorageUtils.ts file
    await writeJsxToTsFile(
      path.join(utilsPath, 'AsyncStorageUtils.ts'),
      AsyncStorageUtilsTemplate()
    );

    // Create utils NavigatorUtils.ts file
    await writeJsxToTsFile(path.join(utilsPath, 'NavigatorUtils.ts'), NavigatorUtilsTemplate());

    // Create utils NetworkUtils.ts file
    await writeJsxToTsFile(path.join(utilsPath, 'NetworkUtils.ts'), NetworkUtilsTemplate());

    // Create utils SessionUtils.ts file
    await writeJsxToTsFile(path.join(utilsPath, 'SessionUtils.ts'), SessionUtilsTemplate());

    // Create utils StringUtils.ts file
    await writeJsxToTsFile(path.join(utilsPath, 'StringUtils.ts'), StringUtilsTemplate());

    // Create utils ValidationSchemaUtils.ts file
    await writeJsxToTsFile(
      path.join(utilsPath, 'ValidationSchemaUtils.ts'),
      ValidationSchemaUtilsTemplate()
    );

    // Create utils index.ts file
    await writeJsxToTsFile(path.join(utilsPath, 'index.ts'), UtilTemplate());
  } catch (error) {
    showError(error, spinner, colors);
  }
};
