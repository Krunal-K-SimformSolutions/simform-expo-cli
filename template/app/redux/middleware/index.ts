export * from './SocketMiddleware.js';

/**
 *
 */
export const MiddlewareTemplate = (): string => {
  return `
    export { socketMiddleware } from './SocketMiddleware';
  `;
};
