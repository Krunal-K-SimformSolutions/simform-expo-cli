import path from 'path';
import fs from 'fs-extra';
import {
  ApiConstTemplate,
  AppConstTemplate,
  ConstantsTemplate,
  MockDataConstTemplate,
  NavigationRoutesConstTemplate,
  RegexConstTemplate,
  StaticDataConstTemplate,
  StorageKeyConstTemplate,
  StoreActionConstTemplate,
  ENTemplate
} from '../../template/index.js';
import { AppConstant, getTheme } from '../constants/index.js';
import { QuestionAnswer } from '../questions/index.js';
import { showError, writeJsxToTsFile } from '../utils/index.js';
import { generateStringConst } from './GenerateStringConst.js';
import type { Indicators } from '../utils/index.js';

/**
 *
 */
export const generateConstants = async (appPath: string, spinner: Indicators) => {
  const colors = getTheme();

  try {
    const variables = QuestionAnswer.instance;

    const isReduxThunk = variables.isSupportStateManagementMiddleware(
      AppConstant.StateManagementMiddleware.ReduxThunk
    );
    const isReduxSaga = variables.isSupportStateManagementMiddleware(
      AppConstant.StateManagementMiddleware.ReduxSaga
    );

    const isAxios = variables.isSupportApiMiddleware(AppConstant.ApiMiddleware.Axios);
    const isAWSAmplify = variables.isSupportApiMiddleware(AppConstant.ApiMiddleware.AWSAmplify);
    const isFetch = variables.isSupportApiMiddleware(AppConstant.ApiMiddleware.Fetch);

    const isTranslations = variables.isSupportFeature(AppConstant.AddFeature.Translations);

    // Create constants directory if it doesn't exist
    const constantsPath = path.join(appPath, 'constants');
    await fs.mkdir(constantsPath, { recursive: true });

    if (isAxios || isAWSAmplify || isFetch) {
      // Create APIConst.ts file
      await writeJsxToTsFile(path.join(constantsPath, 'APIConst.ts'), ApiConstTemplate());
    }

    // Create AppConst.ts file
    await writeJsxToTsFile(path.join(constantsPath, 'AppConst.ts'), AppConstTemplate());

    // Create MockDataConst.ts file
    await writeJsxToTsFile(path.join(constantsPath, 'MockDataConst.ts'), MockDataConstTemplate());

    // Create NavigationRoutesConst.ts file
    await writeJsxToTsFile(
      path.join(constantsPath, 'NavigationRoutesConst.ts'),
      NavigationRoutesConstTemplate()
    );

    // Create RegexConst.ts file
    await writeJsxToTsFile(path.join(constantsPath, 'RegexConst.ts'), RegexConstTemplate());

    // Create StaticDataConst.ts file
    await writeJsxToTsFile(
      path.join(constantsPath, 'StaticDataConst.ts'),
      StaticDataConstTemplate()
    );

    // Create StorageKeyConst.ts file
    await writeJsxToTsFile(
      path.join(constantsPath, 'StorageKeyConst.ts'),
      StorageKeyConstTemplate()
    );

    if (isReduxThunk || isReduxSaga) {
      // Create StoreActionConst.ts file
      await writeJsxToTsFile(
        path.join(constantsPath, 'StoreActionConst.ts'),
        StoreActionConstTemplate()
      );
    }

    // Create StringConst.ts file
    await generateStringConst(
      ENTemplate(),
      path.join(constantsPath, 'StringConst.ts'),
      isTranslations
    );

    // Create constants index.ts file
    await writeJsxToTsFile(path.join(constantsPath, 'index.ts'), ConstantsTemplate());
  } catch (error) {
    showError(error, spinner, colors);
  }
};
