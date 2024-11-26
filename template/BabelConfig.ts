/**
 *
 */
export const BabelConfigTemplate = (): string => {
  return `
    /**
     * This file is used to configure the Babel transpiler.
     */
    module.exports = function (api) {
      api.cache(true);
      return {
        presets: ['babel-preset-expo'],
        env: {
          development: {},
          production: {
            plugins: ['transform-remove-console']
          }
        }
      };
    };
  `;
};
