import path from 'path';
import fs from 'fs-extra';
import { AppConstant, getTheme } from '../constants/index.js';
import { QuestionAnswer } from '../questions/index.js';
import { showError } from '../utils/index.js';
import type { Indicators } from '../utils/index.js';

/**
 *
 */
export const copyFiles = async (appPath: string, spinner: Indicators) => {
  const colors = getTheme();

  try {
    const variables = QuestionAnswer.instance;

    const isAWSAmplify = variables.isSupportApiMiddleware(AppConstant.ApiMiddleware.AWSAmplify);
    const isAxios = variables.isSupportApiMiddleware(AppConstant.ApiMiddleware.Axios);
    const isFetch = variables.isSupportApiMiddleware(AppConstant.ApiMiddleware.Fetch);

    const isSocket = variables.isSupportFeature(AppConstant.AddFeature.Socket);

    // Copy custom text component readme file
    const dstCustomText = path.join(appPath, 'components/custom-text/README.md');
    const srcCustomText = path.join(
      import.meta.dirname,
      '../../template/app/components/custom-text/README.md'
    );
    await fs.copyFile(srcCustomText, dstCustomText);

    // Copy toast component readme file
    const dstToast = path.join(appPath, 'components/toast/README.md');
    const srcToast = path.join(
      import.meta.dirname,
      '../../template/app/components/toast/README.md'
    );
    await fs.copyFile(srcToast, dstToast);

    if (isAWSAmplify || isAxios || isFetch) {
      // Copy api readme file
      const dstApi = path.join(appPath, 'configs/api/README.md');
      const srcApi = path.join(import.meta.dirname, '../../template/app/configs/api/README.md');
      await fs.copyFile(srcApi, dstApi);
    }

    if (isSocket) {
      // Copy socket readme file
      const dstSocket = path.join(appPath, 'configs/socket/README.md');
      const srcSocket = path.join(
        import.meta.dirname,
        '../../template/app/configs/socket/README.md'
      );
      await fs.copyFile(srcSocket, dstSocket);
    }

    // Copy adaptive icon file
    const dstAdaptiveIcon = path.join(appPath, 'assets/icons/adaptiveIcon.png');
    const srcAdaptiveIcon = path.join(
      import.meta.dirname,
      '../../template/app/assets/icons/adaptiveIcon.png'
    );
    await fs.copyFile(srcAdaptiveIcon, dstAdaptiveIcon);

    // Copy app icon file
    const dstAppIcon = path.join(appPath, 'assets/icons/appIcon.png');
    const srcAppIcon = path.join(
      import.meta.dirname,
      '../../template/app/assets/icons/appIcon.png'
    );
    await fs.copyFile(srcAppIcon, dstAppIcon);

    // Copy splash screen image file
    const dstSplashScreen = path.join(appPath, 'assets/images/splashScreen.png');
    const srcSplashScreen = path.join(
      import.meta.dirname,
      '../../template/app/assets/images/splashScreen.png'
    );
    await fs.copyFile(srcSplashScreen, dstSplashScreen);

    // Copy bold font file
    const dstBoldFont = path.join(appPath, 'assets/fonts/Poppins-Bold.ttf');
    const srcBoldFont = path.join(
      import.meta.dirname,
      '../../template/app/assets/fonts/Poppins-Bold.ttf'
    );
    await fs.copyFile(srcBoldFont, dstBoldFont);

    // Copy medium font file
    const dstMediumFont = path.join(appPath, 'assets/fonts/Poppins-Medium.ttf');
    const srcMediumFont = path.join(
      import.meta.dirname,
      '../../template/app/assets/fonts/Poppins-Medium.ttf'
    );
    await fs.copyFile(srcMediumFont, dstMediumFont);

    // Copy regular font file
    const dstRegularFont = path.join(appPath, 'assets/fonts/Poppins-Regular.ttf');
    const srcRegularFont = path.join(
      import.meta.dirname,
      '../../template/app/assets/fonts/Poppins-Regular.ttf'
    );
    await fs.copyFile(srcRegularFont, dstRegularFont);

    // Copy semi bold font file
    const dstSemiBoldFont = path.join(appPath, 'assets/fonts/Poppins-SemiBold.ttf');
    const srcSemiBoldFont = path.join(
      import.meta.dirname,
      '../../template/app/assets/fonts/Poppins-SemiBold.ttf'
    );
    await fs.copyFile(srcSemiBoldFont, dstSemiBoldFont);
  } catch (error) {
    showError(error, spinner, colors);
  }
};
