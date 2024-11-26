import path from 'path';
import fs from 'fs-extra';
import {
  ApplicationStylesTemplate,
  ColorsTemplate,
  MetricsTemplate,
  ThemeTemplate
} from '../../template/index.js';
import { getTheme } from '../constants/index.js';
import { showError, writeJsxToTsFile } from '../utils/index.js';
import type { Indicators } from '../utils/index.js';

/**
 *
 */
export const generateThemes = async (appPath: string, spinner: Indicators) => {
  const colors = getTheme();

  try {
    // Create themes directory if it doesn't exist
    const themesPath = path.join(appPath, 'themes');
    await fs.mkdir(themesPath, { recursive: true });

    // Create themes ApplicationStyles.ts file
    await writeJsxToTsFile(
      path.join(themesPath, 'ApplicationStyles.ts'),
      ApplicationStylesTemplate()
    );

    // Create themes Colors.ts file
    await writeJsxToTsFile(path.join(themesPath, 'Colors.ts'), ColorsTemplate());

    // Create themes Metrics.ts file
    await writeJsxToTsFile(path.join(themesPath, 'Metrics.ts'), MetricsTemplate());

    // Create themes index.ts file
    await writeJsxToTsFile(path.join(themesPath, 'index.ts'), ThemeTemplate());
  } catch (error) {
    showError(error, spinner, colors);
  }
};
