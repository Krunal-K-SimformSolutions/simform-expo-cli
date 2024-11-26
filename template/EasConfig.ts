import { QuestionAnswer, AppConstant } from '../src/index.js';

/**
 *
 */
export const EasConfigTemplate = (): string => {
  const variables = QuestionAnswer.instance;

  const setupEnv = variables.getSetupEnv;
  const isSetupEnv = setupEnv.length > 0;

  const envJson = setupEnv
    .map(
      (env) => `"${env}": {
          "extends": "base",
          "distribution": "internal",
          ${
            variables.isSupportDevelopmentEnv(AppConstant.SetupEnv.Development)
              ? ` "developmentClient": true,
                  "ios": {
                    "simulator": true
                  },
                `
              : ''
          }
          "env": {
            "NODE_ENV": "${env}"
          }
        }`
    )
    .join(',\n');

  return `
    {
      "cli": {
        "version": ">= 4.1.2",
        "appVersionSource": "remote"
      },
      "build": {
        "base": {
          "node": "20.11.1",
          "ios": {
            "resourceClass": "m-medium"
          },
          "env": {
            "NODE_ENV": "development"
          }
        },
        ${isSetupEnv ? envJson : ''}
      },
      "submit": {
        "production": {}
      }
    }
  `;
};
