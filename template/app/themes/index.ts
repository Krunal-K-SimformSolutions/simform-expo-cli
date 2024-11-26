export * from './ApplicationStyles.js';
export * from './Colors.js';
export * from './Metrics.js';

/**
 *
 */
export const ThemeTemplate = (): string => {
  return `
    export { default as ApplicationStyles } from './ApplicationStyles';
    export { default as Colors, ThemeModeEnum, type ThemeMode } from './Colors';
    export * from './Metrics';
  `;
};
