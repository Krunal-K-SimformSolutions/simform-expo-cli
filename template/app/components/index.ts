export * from './custom-text/index.js';
export * from './toast/index.js';

/**
 *
 */
export const ComponentTemplate = (): string => {
  return `
    export * from './custom-text';
    export * from './toast';
  `;
};
