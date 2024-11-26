import path from 'path';
import fs from 'fs-extra';
import { ENTemplate, HITemplate, TranslationTemplate } from '../../template/index.js';
import { getTheme } from '../constants/index.js';
import { showError, writeJsxToJsonFile, writeJsxToTsFile } from '../utils/index.js';
import type { Indicators } from '../utils/index.js';

/**
 *
 */
export const generateTranslations = async (appPath: string, spinner: Indicators) => {
  const colors = getTheme();

  try {
    // Create translations directory if it doesn't exist
    const translationsPath = path.join(appPath, 'translations');
    await fs.mkdir(translationsPath, { recursive: true });

    // Create translations en.json file
    await writeJsxToJsonFile(path.join(translationsPath, 'en.json'), ENTemplate());

    // Create translations nl.json file
    await writeJsxToJsonFile(path.join(translationsPath, 'hi.json'), HITemplate());

    // Create translations index.ts file
    await writeJsxToTsFile(path.join(translationsPath, 'index.ts'), TranslationTemplate());
  } catch (error) {
    showError(error, spinner, colors);
  }
};
