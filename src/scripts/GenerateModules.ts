import { ModuleTemplate } from '../../template/index.js';
import path from 'path';
import fs from 'fs-extra';
import { getTheme } from '../constants/index.js';
import { Indicators, showError, writeJsxToTsFile } from '../utils/index.js';

export const generateModules = async (appPath: string, spinner: Indicators) => {
  const colors = getTheme();

  try {
    // Create modules directory if it doesn't exist
    const modulesPath = path.join(appPath, 'modules');
    await fs.mkdir(modulesPath, { recursive: true });

    // Create modules index.ts file
    await writeJsxToTsFile(path.join(modulesPath, 'index.ts'), ModuleTemplate());
  } catch (error) {
    showError(error, spinner, colors);
  }
};
