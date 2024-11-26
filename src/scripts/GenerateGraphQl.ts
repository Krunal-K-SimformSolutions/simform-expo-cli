import path from 'path';
import fs from 'fs-extra';
import {
  AuthMutationsTemplate,
  AuthQueriesTemplate,
  GraphQlTemplate,
  MutationTemplate,
  QueryTemplate
} from '../../template/index.js';
import { getTheme } from '../constants/index.js';
import { showError, writeJsxToTsFile } from '../utils/index.js';
import type { Indicators } from '../utils/index.js';

/**
 *
 */
export const generateGraphQl = async (appPath: string, spinner: Indicators) => {
  const colors = getTheme();

  try {
    // Create graphql directory if it doesn't exist
    const graphqlPath = path.join(appPath, 'graphql');
    await fs.mkdir(graphqlPath, { recursive: true });

    // Create mutations directory if it doesn't exist
    const mutationsPath = path.join(graphqlPath, 'mutations');
    await fs.mkdir(mutationsPath, { recursive: true });

    // Create mutations AuthMutations.ts file
    await writeJsxToTsFile(path.join(mutationsPath, 'AuthMutations.ts'), AuthMutationsTemplate());

    // Create mutations index.ts file
    await writeJsxToTsFile(path.join(mutationsPath, 'index.ts'), MutationTemplate());

    // Create queries directory if it doesn't exist
    const queriesPath = path.join(graphqlPath, 'queries');
    await fs.mkdir(queriesPath, { recursive: true });

    // Create queries AuthQueries.ts file
    await writeJsxToTsFile(path.join(queriesPath, 'AuthQueries.ts'), AuthQueriesTemplate());

    // Create queries index.ts file
    await writeJsxToTsFile(path.join(queriesPath, 'index.ts'), QueryTemplate());

    // Create graphql index.ts file
    await writeJsxToTsFile(path.join(graphqlPath, 'index.ts'), GraphQlTemplate());
  } catch (error) {
    showError(error, spinner, colors);
  }
};
