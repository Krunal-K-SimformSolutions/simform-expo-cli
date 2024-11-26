import path from 'path';
import fs from 'fs-extra';
import {
  SignInRequestTemplate,
  ToastTypeTemplate,
  TypeTemplate,
  UserResponseTemplate
} from '../../template/index.js';
import { getTheme } from '../constants/index.js';
import { showError, writeJsxToTsFile } from '../utils/index.js';
import type { Indicators } from '../utils/index.js';

/**
 *
 */
export const generateTypes = async (appPath: string, spinner: Indicators) => {
  const colors = getTheme();

  try {
    // Create types directory if it doesn't exist
    const typesPath = path.join(appPath, 'types');
    await fs.mkdir(typesPath, { recursive: true });

    // Create types SignInRequest.ts file
    await writeJsxToTsFile(path.join(typesPath, 'SignInRequest.ts'), SignInRequestTemplate());

    // Create types UserResponse.ts file
    await writeJsxToTsFile(path.join(typesPath, 'UserResponse.ts'), UserResponseTemplate());

    // Create types ToastType.ts file
    await writeJsxToTsFile(path.join(typesPath, 'ToastType.ts'), ToastTypeTemplate());

    // Create types index.ts file
    await writeJsxToTsFile(path.join(typesPath, 'index.ts'), TypeTemplate());
  } catch (error) {
    showError(error, spinner, colors);
  }
};
