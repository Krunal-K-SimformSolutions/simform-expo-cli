import path from 'path';
import fs from 'fs-extra';
import {
  HooksUtilTemplate,
  HookTemplate,
  UseAppStateTemplate,
  UseAsyncStorageTemplate,
  UseBackHandlerTemplate,
  UseDeepCompareCallbackTemplate,
  UseDeepCompareEffectTemplate,
  UseDeepCompareMemoizeTemplate,
  UseHeaderTemplate,
  UseKeyboardTemplate,
  UseLazyQueryWithCancelTokenTemplate,
  UseMutationWithCancelTokenTemplate,
  UsePreviousTemplate,
  UseQueryWithCancelTokenTemplate,
  UseSubscriptionWithCancelTokenTemplate,
  UseThemeTemplate,
  UseTimeoutTemplate
} from '../../template/index.js';
import { AppConstant, getTheme } from '../constants/index.js';
import { QuestionAnswer } from '../questions/index.js';
import { showError, writeJsxToTsFile } from '../utils/index.js';
import type { Indicators } from '../utils/index.js';

/**
 *
 */
export const generateHooks = async (appPath: string, spinner: Indicators) => {
  const colors = getTheme();

  try {
    const variables = QuestionAnswer.instance;
    const isGraphQL = variables.isSupportStateManagement(AppConstant.StateManagement.GraphQL);

    // Create hooks directory if it doesn't exist
    const hooksPath = path.join(appPath, 'hooks');
    await fs.mkdir(hooksPath, { recursive: true });

    // Create hooks-utils directory if it doesn't exist
    const hooksUtilsPath = path.join(hooksPath, 'hooks-utils');
    await fs.mkdir(hooksUtilsPath, { recursive: true });

    // Create hooks-utils useDeepCompareMemoize.ts file
    await writeJsxToTsFile(
      path.join(hooksUtilsPath, 'useDeepCompareMemoize.ts'),
      UseDeepCompareMemoizeTemplate()
    );

    // Create hooks-utils index.ts file
    await writeJsxToTsFile(path.join(hooksUtilsPath, 'index.ts'), HooksUtilTemplate());

    // Create hooks useAppState.ts file
    await writeJsxToTsFile(path.join(hooksPath, 'useAppState.ts'), UseAppStateTemplate());

    // Create hooks useAsyncStorage.ts file
    await writeJsxToTsFile(path.join(hooksPath, 'useAsyncStorage.ts'), UseAsyncStorageTemplate());

    // Create hooks useBackHandler.ts file
    await writeJsxToTsFile(path.join(hooksPath, 'useBackHandler.ts'), UseBackHandlerTemplate());

    // Create hooks useDeepCompareCallback.ts file
    await writeJsxToTsFile(
      path.join(hooksPath, 'useDeepCompareCallback.ts'),
      UseDeepCompareCallbackTemplate()
    );

    // Create hooks useDeepCompareEffect.ts file
    await writeJsxToTsFile(
      path.join(hooksPath, 'useDeepCompareEffect.ts'),
      UseDeepCompareEffectTemplate()
    );

    // Create hooks useHeader.ts file
    await writeJsxToTsFile(path.join(hooksPath, 'useHeader.ts'), UseHeaderTemplate());

    // Create hooks useKeyboard.ts file
    await writeJsxToTsFile(path.join(hooksPath, 'useKeyboard.ts'), UseKeyboardTemplate());

    if (isGraphQL) {
      // Create hooks useLazyQueryWithCancelToken.ts file
      await writeJsxToTsFile(
        path.join(hooksPath, 'useLazyQueryWithCancelToken.ts'),
        UseLazyQueryWithCancelTokenTemplate()
      );

      // Create hooks useMutationWithCancelToken.ts file
      await writeJsxToTsFile(
        path.join(hooksPath, 'useMutationWithCancelToken.ts'),
        UseMutationWithCancelTokenTemplate()
      );
    }

    // Create hooks usePrevious.ts file
    await writeJsxToTsFile(path.join(hooksPath, 'usePrevious.ts'), UsePreviousTemplate());

    if (isGraphQL) {
      // Create hooks useQueryWithCancelToken.ts file
      await writeJsxToTsFile(
        path.join(hooksPath, 'useQueryWithCancelToken.ts'),
        UseQueryWithCancelTokenTemplate()
      );

      // Create hooks useSubscriptionWithCancelToken.ts file
      await writeJsxToTsFile(
        path.join(hooksPath, 'useSubscriptionWithCancelToken.ts'),
        UseSubscriptionWithCancelTokenTemplate()
      );
    }

    // Create hooks useTheme.ts file
    await writeJsxToTsFile(path.join(hooksPath, 'useTheme.ts'), UseThemeTemplate());

    // Create hooks useTimeout.ts file
    await writeJsxToTsFile(path.join(hooksPath, 'useTimeout.ts'), UseTimeoutTemplate());

    // Create hooks index.ts file
    await writeJsxToTsFile(path.join(hooksPath, 'index.ts'), HookTemplate());
  } catch (error) {
    showError(error, spinner, colors);
  }
};
