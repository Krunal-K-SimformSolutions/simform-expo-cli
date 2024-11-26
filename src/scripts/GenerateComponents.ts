import path from 'path';
import fs from 'fs-extra';
import {
  ComponentTemplate,
  CustomTextIndexTemplate,
  CustomTextStylesTemplate,
  CustomTextTemplate,
  CustomTextTypesTemplate,
  GestureRecognizerTemplate,
  GestureRecognizerTypesTemplate,
  GestureRecognizerUtilTemplate,
  GestureTemplate,
  ToastHolderTemplate,
  ToastIndexTemplate,
  ToastStyleTemplate,
  ToastTemplate,
  ToastTypesTemplate,
  ToastUtilTemplate,
  UseGestureRecognizerTemplate,
  UseToastTemplate
} from '../../template/index.js';
import { getTheme } from '../constants/index.js';
import { showError, writeJsxToTsFile } from '../utils/index.js';
import type { Indicators } from '../utils/index.js';

/**
 *
 */
export const generateComponents = async (appPath: string, spinner: Indicators) => {
  const colors = getTheme();

  try {
    // Create components directory if it doesn't exist
    const componentsPath = path.join(appPath, 'components');
    await fs.mkdir(componentsPath, { recursive: true });

    // Create custom-text directory if it doesn't exist
    const customTextPath = path.join(componentsPath, 'custom-text');
    await fs.mkdir(customTextPath, { recursive: true });

    // Create custom-text CustomText.tsx file
    await writeJsxToTsFile(path.join(customTextPath, 'CustomText.tsx'), CustomTextTemplate());

    // Create custom-text CustomTextStyles.ts file
    await writeJsxToTsFile(
      path.join(customTextPath, 'CustomTextStyles.ts'),
      CustomTextStylesTemplate()
    );

    // Create custom-text CustomTextTypes.ts file
    await writeJsxToTsFile(
      path.join(customTextPath, 'CustomTextTypes.ts'),
      CustomTextTypesTemplate()
    );

    // Create custom-text index.ts file
    await writeJsxToTsFile(path.join(customTextPath, 'index.ts'), CustomTextIndexTemplate());

    // Create toast directory if it doesn't exist
    const toastPath = path.join(componentsPath, 'toast');
    await fs.mkdir(toastPath, { recursive: true });

    // Create toast/gesture directory if it doesn't exist
    const gesturePath = path.join(toastPath, 'gesture');
    await fs.mkdir(gesturePath, { recursive: true });

    // Create toast/gesture GestureRecognizer.tsx file
    await writeJsxToTsFile(
      path.join(gesturePath, 'GestureRecognizer.tsx'),
      GestureRecognizerTemplate()
    );

    // Create toast/gesture GestureRecognizerTypes.ts file
    await writeJsxToTsFile(
      path.join(gesturePath, 'GestureRecognizerTypes.ts'),
      GestureRecognizerTypesTemplate()
    );

    // Create toast/gesture GestureRecognizerUtil.ts file
    await writeJsxToTsFile(
      path.join(gesturePath, 'GestureRecognizerUtil.ts'),
      GestureRecognizerUtilTemplate()
    );

    // Create toast/gesture useGestureRecognizer.ts file
    await writeJsxToTsFile(
      path.join(gesturePath, 'useGestureRecognizer.ts'),
      UseGestureRecognizerTemplate()
    );

    // Create toast/gesture index.ts file
    await writeJsxToTsFile(path.join(gesturePath, 'index.ts'), GestureTemplate());

    // Create toast Toast.tsx file
    await writeJsxToTsFile(path.join(toastPath, 'Toast.tsx'), ToastTemplate());

    // Create toast ToastHolder.ts file
    await writeJsxToTsFile(path.join(toastPath, 'ToastHolder.ts'), ToastHolderTemplate());

    // Create toast ToastStyle.ts file
    await writeJsxToTsFile(path.join(toastPath, 'ToastStyle.ts'), ToastStyleTemplate());

    // Create toast ToastTypes.ts file
    await writeJsxToTsFile(path.join(toastPath, 'ToastTypes.ts'), ToastTypesTemplate());

    // Create toast ToastUtil.ts file
    await writeJsxToTsFile(path.join(toastPath, 'ToastUtil.ts'), ToastUtilTemplate());

    // Create toast useToast.ts file
    await writeJsxToTsFile(path.join(toastPath, 'useToast.ts'), UseToastTemplate());

    // Create toast index.ts file
    await writeJsxToTsFile(path.join(toastPath, 'index.ts'), ToastIndexTemplate());

    // Create components index.ts file
    await writeJsxToTsFile(path.join(componentsPath, 'index.ts'), ComponentTemplate());
  } catch (error) {
    showError(error, spinner, colors);
  }
};
