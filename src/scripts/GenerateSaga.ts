import path from 'path';
import fs from 'fs-extra';
import { SagaTemplate, AuthSagaTemplate } from '../../template/index.js';
import { getTheme } from '../constants/index.js';
import { showError, writeJsxToTsFile } from '../utils/index.js';
import type { Indicators } from '../utils/index.js';

/**
 *
 */
export const generateSaga = async (appPath: string, spinner: Indicators) => {
  const colors = getTheme();

  try {
    // Create saga directory if it doesn't exist
    const sagaPath = path.join(appPath, 'saga');
    await fs.mkdir(sagaPath, { recursive: true });

    // Create saga AuthSaga.ts file
    await writeJsxToTsFile(path.join(sagaPath, 'AuthSaga.ts'), AuthSagaTemplate());

    // Create saga index.ts file
    await writeJsxToTsFile(path.join(sagaPath, 'index.ts'), SagaTemplate());
  } catch (error) {
    showError(error, spinner, colors);
  }
};
