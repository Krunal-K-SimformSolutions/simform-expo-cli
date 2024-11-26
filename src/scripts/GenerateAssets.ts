import path from 'path';
import fs from 'fs-extra';
import {
  AssetsTemplate,
  FontTemplate,
  IconTemplate,
  ImageTemplate,
  SvgCloseWithCircleIconTemplate,
  SvgTemplate,
  SvgToastSuccessIconTemplate,
  SvgToastWarningIconTemplate
} from '../../template/index.js';
import { getTheme } from '../constants/index.js';
import { showError, writeJsxToTsFile } from '../utils/index.js';
import type { Indicators } from '../utils/index.js';

/**
 * Creates an assets directory at the given app path and writes the following assets:
 *
 * - fonts directory with an index.ts file
 * - icons directory with an index.ts file
 * - images directory with an index.ts file
 * - svgs directory with an index.ts file and CloseWithCircleIcon.tsx,
 *   ToastSuccessIcon.tsx, and ToastWarningIcon.tsx files.
 *
 * @param appPath The path where the assets directory should be created.
 * @param spinner The spinner to use when displaying progress.
 * @returns A promise that resolves when the assets directory has been created.
 */
export const generateAssets = async (appPath: string, spinner: Indicators) => {
  const colors = getTheme();

  try {
    // Create assets directory if it doesn't exist
    const assetsPath = path.join(appPath, 'assets');
    await fs.mkdir(assetsPath, { recursive: true });

    // Create assets index.ts file
    await writeJsxToTsFile(path.join(assetsPath, 'index.ts'), AssetsTemplate());

    // Create fonts directory if it doesn't exist
    const fontsPath = path.join(assetsPath, 'fonts');
    await fs.mkdir(fontsPath, { recursive: true });

    // Create fonts index.ts file
    await writeJsxToTsFile(path.join(fontsPath, 'index.ts'), FontTemplate());

    // Create icons directory if it doesn't exist
    const iconsPath = path.join(assetsPath, 'icons');
    await fs.mkdir(iconsPath, { recursive: true });

    // Create icons index.ts file
    await writeJsxToTsFile(path.join(iconsPath, 'index.ts'), IconTemplate());

    // Create images directory if it doesn't exist
    const imagesPath = path.join(assetsPath, 'images');
    await fs.mkdir(imagesPath, { recursive: true });

    // Create images index.ts file
    await writeJsxToTsFile(path.join(imagesPath, 'index.ts'), ImageTemplate());

    // Create svgs directory if it doesn't exist
    const svgsPath = path.join(assetsPath, 'svgs');
    await fs.mkdir(svgsPath, { recursive: true });

    // Create svgs CloseWithCircleIcon.tsx file
    await writeJsxToTsFile(
      path.join(svgsPath, 'CloseWithCircleIcon.tsx'),
      SvgCloseWithCircleIconTemplate()
    );

    // Create svgs ToastSuccessIcon.tsx file
    await writeJsxToTsFile(
      path.join(svgsPath, 'ToastSuccessIcon.tsx'),
      SvgToastSuccessIconTemplate()
    );

    // Create svgs ToastWarningIcon.tsx file
    await writeJsxToTsFile(
      path.join(svgsPath, 'ToastWarningIcon.tsx'),
      SvgToastWarningIconTemplate()
    );

    // Create svgs index.ts file
    await writeJsxToTsFile(path.join(svgsPath, 'index.ts'), SvgTemplate());
  } catch (error) {
    showError(error, spinner, colors);
  }
};
