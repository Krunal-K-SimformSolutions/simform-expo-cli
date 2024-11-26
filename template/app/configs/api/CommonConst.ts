/**
 *
 */
export const CommonConstTemplate = (): string => {
  return `
    export const DEFAULT_VALUE = Object.freeze({
      header: 'Authorization',
      headerPrefix: 'Bearer ',
      expireFudge: 10,
      statusCodes: [401, 422],
      messageText: 'Token is expired'
    });
  `;
};
