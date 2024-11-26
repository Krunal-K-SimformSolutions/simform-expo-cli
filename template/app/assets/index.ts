export * from './fonts/index.js';
export * from './icons/index.js';
export * from './images/index.js';
export * from './svgs/index.js';

export const AssetsTemplate = (): string => {
  return `
    export { default as Fonts } from './fonts';
    export { default as Icons } from './icons';
    export { default as Images } from './images';
    export { default as Svgs } from './svgs';
  `;
};
