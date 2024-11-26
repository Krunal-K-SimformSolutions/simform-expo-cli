import path from 'path';
import fs from 'fs-extra';
import {
  ModulesLayoutTemplate,
  ModulesScreenTemplate,
  NotFoundScreenTemplate
} from '../../template/index.js';
import { getTheme } from '../constants/index.js';
import { showError, writeJsxToTsFile } from '../utils/index.js';
import type { Indicators } from '../utils/index.js';

/**
 *
 */
export const generateModules = async (appPath: string, spinner: Indicators) => {
  const colors = getTheme();

  try {
    // Create modules directory if it doesn't exist
    const modulesPath = path.join(appPath, 'modules');
    await fs.mkdir(modulesPath, { recursive: true });

    // Create modules _layout.tsx file
    await writeJsxToTsFile(path.join(modulesPath, '_layout.tsx'), ModulesLayoutTemplate());

    // Create modules +not-found.tsx file
    await writeJsxToTsFile(path.join(modulesPath, '+not-found.tsx'), NotFoundScreenTemplate());

    // Create modules modules.tsx file
    await writeJsxToTsFile(path.join(modulesPath, 'modules.tsx'), ModulesScreenTemplate());
  } catch (error) {
    showError(error, spinner, colors);
  }
};
