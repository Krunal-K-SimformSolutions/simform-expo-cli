export * from './mutations/index.js';
export * from './queries/index.js';

/**
 *
 */
export const GraphQlTemplate = (): string => {
  return `
    export * from './mutations';
    export * from './queries';
  `;
};
