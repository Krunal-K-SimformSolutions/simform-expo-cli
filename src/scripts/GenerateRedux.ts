import path from 'path';
import fs from 'fs-extra';
import {
  AppRequestInitialTemplate,
  AppRequestSelectorTemplate,
  AppRequestSliceTemplate,
  AppRequestTemplate,
  AuthInitialTemplate,
  AuthSelectorTemplate,
  AuthSliceTemplate,
  AuthTemplate,
  MiddlewareTemplate,
  ReduxTemplate,
  ReduxUtilsTemplate,
  SocketMiddlewareTemplate,
  StoreTemplate,
  UseReduxTemplate
} from '../../template/index.js';
import { AppConstant, getTheme } from '../constants/index.js';
import { QuestionAnswer } from '../questions/index.js';
import { showError, writeJsxToTsFile } from '../utils/index.js';
import type { Indicators } from '../utils/index.js';

/**
 *
 */
export const generateRedux = async (appPath: string, spinner: Indicators) => {
  const colors = getTheme();

  try {
    const variables = QuestionAnswer.instance;

    const isReduxThunk = variables.isSupportStateManagementMiddleware(
      AppConstant.StateManagementMiddleware.ReduxThunk
    );

    const isSocket = variables.isSupportFeature(AppConstant.AddFeature.Socket);

    // Create redux directory if it doesn't exist
    const reduxPath = path.join(appPath, 'redux');
    await fs.mkdir(reduxPath, { recursive: true });

    if (isSocket) {
      // Create app-request directory if it doesn't exist
      const appRequestPath = path.join(reduxPath, 'app-request');
      await fs.mkdir(appRequestPath, { recursive: true });

      // Create app-request AppRequestInitial.ts file
      await writeJsxToTsFile(
        path.join(appRequestPath, 'AppRequestInitial.ts'),
        AppRequestInitialTemplate()
      );

      // Create app-request AppRequestSelector.ts file
      await writeJsxToTsFile(
        path.join(appRequestPath, 'AppRequestSelector.ts'),
        AppRequestSelectorTemplate()
      );

      // Create app-request AppRequestSlice.ts file
      await writeJsxToTsFile(
        path.join(appRequestPath, 'AppRequestSlice.ts'),
        AppRequestSliceTemplate()
      );

      // Create app-request index.ts file
      await writeJsxToTsFile(path.join(appRequestPath, 'index.ts'), AppRequestTemplate());
    }

    // Create auth directory if it doesn't exist
    const authPath = path.join(reduxPath, 'auth');
    await fs.mkdir(authPath, { recursive: true });

    // Create auth AuthInitial.ts file
    await writeJsxToTsFile(path.join(authPath, 'AuthInitial.ts'), AuthInitialTemplate());

    // Create auth AuthSelector.ts file
    await writeJsxToTsFile(path.join(authPath, 'AuthSelector.ts'), AuthSelectorTemplate());

    // Create auth AuthSlice.ts file
    await writeJsxToTsFile(path.join(authPath, 'AuthSlice.ts'), AuthSliceTemplate());

    // Create auth index.ts file
    await writeJsxToTsFile(path.join(authPath, 'index.ts'), AuthTemplate());

    if (isSocket && isReduxThunk) {
      // Create middleware directory if it doesn't exist
      const middlewarePath = path.join(reduxPath, 'middleware');
      await fs.mkdir(middlewarePath, { recursive: true });

      // Create middleware SocketMiddleware.ts file
      await writeJsxToTsFile(
        path.join(middlewarePath, 'SocketMiddleware.ts'),
        SocketMiddlewareTemplate()
      );

      // Create middleware index.ts file
      await writeJsxToTsFile(path.join(middlewarePath, 'index.ts'), MiddlewareTemplate());
    }

    // Create redux ReduxUtils.ts file
    await writeJsxToTsFile(path.join(reduxPath, 'ReduxUtils.ts'), ReduxUtilsTemplate());

    // Create redux Store.ts file
    await writeJsxToTsFile(path.join(reduxPath, 'Store.ts'), StoreTemplate());

    // Create redux useRedux.ts file
    await writeJsxToTsFile(path.join(reduxPath, 'useRedux.ts'), UseReduxTemplate());

    // Create redux index.ts file
    await writeJsxToTsFile(path.join(reduxPath, 'index.ts'), ReduxTemplate());
  } catch (error) {
    showError(error, spinner, colors);
  }
};
