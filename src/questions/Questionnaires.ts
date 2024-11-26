/* eslint-disable no-restricted-syntax */
import { type Theme } from '@inquirer/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import { input, number, select, checkbox, confirm } from '@inquirer/prompts';
import chalk from 'chalk';
import _ from 'lodash';
import { AppConstant, getTheme } from '../constants/index.js';
import { cmdRunner, questionBuilder, showError, stringBuilder } from '../utils/index.js';
import { QuestionAnswer } from './QuestionAnswer.js';
import type { Indicators } from '../utils/index.js';
import type { PartialDeep } from '@inquirer/type';

/**
 *
 */
export const askQuestions = async (spinner: Indicators) => {
  const colors = getTheme();

  const customTheme: PartialDeep<Theme> = {
    prefix: {
      done: stringBuilder({ text: '✔', color: colors.prefix.done }),
      idle: stringBuilder({ text: '#', color: colors.prefix.idle }),
      loading: stringBuilder({ text: '...', color: colors.prefix.loading })
    },
    spinner: AppConstant.SpinnerConstants,
    style: {
      /**
       *
       */
      answer: (text: string) =>
        stringBuilder({ text: text, color: colors.answer, modifiers: chalk.bold }),
      /**
       *
       */
      message: (text: string) =>
        stringBuilder({ text: text, color: colors.question, modifiers: chalk.bold }),
      /**
       *
       */
      error: (text: string) =>
        stringBuilder({ text: `> ${text}`, color: colors.error, modifiers: chalk.bold }),
      /**
       *
       */
      defaultAnswer: (text: string) =>
        stringBuilder({ text: text, color: colors.defaultAnswer, modifiers: chalk.bold }),
      /**
       *
       */
      help: (text: string) =>
        stringBuilder({ text: text, color: colors.help, modifiers: chalk.bold.dim }),
      /**
       *
       */
      highlight: (text: string) =>
        stringBuilder({ text: text, color: colors.highlight, modifiers: chalk.bold.italic }),
      /**
       *
       */
      key: (text: string) =>
        stringBuilder({ text: `<${text}>`, color: colors.key, modifiers: chalk.bold.italic })
    }
  };

  try {
    const selectedPackageMng = await select({
      message: questionBuilder(colors, AppConstant.StringConstants.packageManagerQuestion),
      choices: AppConstant.StringConstants.packageManagerChoices,
      default: AppConstant.StringConstants.packageManagerDefault,
      theme: customTheme
    });

    try {
      await cmdRunner(selectedPackageMng, ['--version']);
    } catch {
      spinner.changeMessage(
        {
          text: AppConstant.StringConstants.msgPackageManagerNotFount(selectedPackageMng),
          color: colors.error,
          modifiers: chalk.bold
        },
        'fail'
      );

      process.exit(1);
    }

    QuestionAnswer.instance.setPackageManager = selectedPackageMng;

    console.log('');
    QuestionAnswer.instance.setProjectName = await input({
      message: questionBuilder(
        colors,
        AppConstant.StringConstants.projectNameQuestion,
        AppConstant.StringConstants.projectNameQuestionHelp
      ),
      required: true,
      default: AppConstant.StringConstants.projectNameDefault,
      /**
       *
       */
      validate: (value = '') => {
        if (_.isEmpty(value)) {
          return AppConstant.StringConstants.projectNameRequired;
        } else if (!/^[^\s].*$/.test(value)) {
          return AppConstant.StringConstants.projectNameStartWithSpace;
        } else if (!/^[A-Z][a-zA-Z0-9]+$/.test(value)) {
          return AppConstant.StringConstants.projectNameInvalid;
        }
        return true;
      },
      theme: customTheme
    });

    console.log('');
    QuestionAnswer.instance.setBundleIdentifier = await input({
      message: questionBuilder(
        colors,
        AppConstant.StringConstants.bundleIdentifierQuestion,
        AppConstant.StringConstants.bundleIdentifierQuestionHelp
      ),
      required: true,
      default: AppConstant.StringConstants.bundleIdentifierDefault(
        QuestionAnswer.instance.getProjectNameWithLowerCase
      ),
      /**
       *
       */
      validate: (value = '') => {
        if (_.isEmpty(value)) {
          return AppConstant.StringConstants.bundleIdentifierRequired;
        } else if (!/^[^\s].*$/.test(value)) {
          return AppConstant.StringConstants.bundleIdentifierStartWithSpace;
        } else if (!/^[a-zA-Z0-9.]+$/.test(value)) {
          return AppConstant.StringConstants.bundleIdentifierInvalid;
        }
        return true;
      },
      theme: customTheme
    });

    console.log('');
    QuestionAnswer.instance.setMinAndroidSdkVersion = await number({
      message: questionBuilder(
        colors,
        AppConstant.StringConstants.minAndroidSdkVersionQuestion,
        AppConstant.StringConstants.minAndroidSdkVersionQuestionHelp
      ),
      min: 1,
      max: 100,
      step: 1,
      default: AppConstant.StringConstants.minAndroidSdkVersionDefault,
      required: true,
      /**
       *
       */
      validate: (value) => {
        if (value === undefined) {
          return AppConstant.StringConstants.minAndroidSdkVersionRequired;
        } else if (!/^[^\s].*$/.test(String(value))) {
          return AppConstant.StringConstants.minAndroidSdkVersionStartWithSpace;
        } else if (!/^[0-9-]+$/.test(String(value))) {
          return AppConstant.StringConstants.minAndroidSdkVersionDigit;
        } else if (Number(value) <= 0) {
          return AppConstant.StringConstants.minAndroidSdkVersionInvalid;
        }
        return true;
      },
      theme: customTheme
    });

    console.log('');
    QuestionAnswer.instance.setMinIOSSdkVersion = await number({
      message: questionBuilder(
        colors,
        AppConstant.StringConstants.minIosSdkVersionQuestion,
        AppConstant.StringConstants.minIosSdkVersionQuestionHelp
      ),
      min: 1,
      max: 100,
      step: 0.01,
      default: AppConstant.StringConstants.minIosSdkVersionDefault,
      required: true,
      /**
       *
       */
      validate: (value) => {
        if (value === undefined) {
          return AppConstant.StringConstants.minIosSdkVersionRequired;
        } else if (!/^[^\s].*$/.test(String(value))) {
          return AppConstant.StringConstants.minIosSdkVersionStartWithSpace;
        } else if (!/^[0-9-.]+$/.test(String(value))) {
          return AppConstant.StringConstants.minIosSdkVersionDigit;
        } else if (Number(value) <= 0) {
          return AppConstant.StringConstants.minIosSdkVersionInvalid;
        }
        return true;
      },
      theme: customTheme
    });

    console.log('');
    QuestionAnswer.instance.setSupportEAS = await confirm({
      message: questionBuilder(colors, AppConstant.StringConstants.supportEASQuestion),
      default: AppConstant.StringConstants.supportEASDefault,
      theme: customTheme
    });

    if (QuestionAnswer.instance.getSupportEAS) {
      console.log('');
      QuestionAnswer.instance.setProjectID = await input({
        message: questionBuilder(
          colors,
          AppConstant.StringConstants.easProjectIdQuestion,
          AppConstant.StringConstants.easProjectIdQuestionHelp
        ),
        required: true,
        default: AppConstant.StringConstants.easProjectIdDefault,
        /**
         *
         */
        validate: (value = '') => {
          if (_.isEmpty(value)) {
            return AppConstant.StringConstants.easProjectIdRequired;
          } else if (!/^[^\s].*$/.test(value)) {
            return AppConstant.StringConstants.easProjectIdStartWithSpace;
          }
          return true;
        },
        theme: customTheme
      });

      console.log('');
      QuestionAnswer.instance.setProjectSlug = await input({
        message: questionBuilder(
          colors,
          AppConstant.StringConstants.easProjectSlugQuestion,
          AppConstant.StringConstants.easProjectSlugQuestionHelp
        ),
        required: true,
        default: AppConstant.StringConstants.easProjectSlugDefault,
        /**
         *
         */
        validate: (value = '') => {
          if (_.isEmpty(value)) {
            return AppConstant.StringConstants.easProjectSlugRequired;
          } else if (!/^[^\s].*$/.test(value)) {
            return AppConstant.StringConstants.easProjectSlugStartWithSpace;
          }
          return true;
        },
        theme: customTheme
      });
    }

    console.log('');
    QuestionAnswer.instance.setStateManagement = await select({
      message: questionBuilder(
        colors,
        AppConstant.StringConstants.stateManagementQuestion,
        AppConstant.StringConstants.stateManagementQuestionHelp
      ),
      choices: AppConstant.StringConstants.stateManagementChoices,
      default: AppConstant.StateManagement.ReactRedux,
      theme: customTheme
    });

    if (QuestionAnswer.instance.isSupportStateManagement(AppConstant.StateManagement.ReactRedux)) {
      console.log('');
      QuestionAnswer.instance.setStateManagementMiddleware = await select({
        message: questionBuilder(
          colors,
          AppConstant.StringConstants.stateManagementMiddlewareQuestion
        ),
        choices: AppConstant.StringConstants.stateManagementMiddlewareChoices,
        default: AppConstant.StateManagementMiddleware.ReduxThunk,
        theme: customTheme
      });

      console.log('');
      QuestionAnswer.instance.setApiMiddleware = await checkbox({
        message: questionBuilder(colors, AppConstant.StringConstants.apiMiddlewareQuestion),
        required: true,
        choices: AppConstant.StringConstants.apiMiddlewareChoices,
        /**
         *
         */
        validate: (value) => {
          if (_.size(value) <= 0) {
            return AppConstant.StringConstants.apiMiddlewareRequired;
          }
          return true;
        },
        theme: customTheme
      });

      console.log('');
      QuestionAnswer.instance.setApiBaseURL = await input({
        message: questionBuilder(
          colors,
          AppConstant.StringConstants.apiBaseURLQuestion,
          AppConstant.StringConstants.apiBaseURLQuestionHelp
        ),
        required: true,
        default: AppConstant.StringConstants.apiBaseURLDefault,
        /**
         *
         */
        validate: (value = '') => {
          if (_.isEmpty(value)) {
            return AppConstant.StringConstants.apiBaseURLRequired;
          } else if (!/^[^\s].*$/.test(value)) {
            return AppConstant.StringConstants.apiBaseURLStartWithSpace;
          } else if (!/^((http|https):\/\/)*/.test(value)) {
            return AppConstant.StringConstants.apiBaseURLInvalid;
          }
          return true;
        },
        theme: customTheme
      });
    }

    console.log('');
    QuestionAnswer.instance.setAddFeatures = await checkbox({
      message: questionBuilder(colors, AppConstant.StringConstants.addFeatureQuestion),
      required: true,
      choices: AppConstant.StringConstants.addFeatureChoices,
      /**
       *
       */
      validate: (value) => {
        if (_.size(value) <= 0) {
          return AppConstant.StringConstants.addFeatureRequired;
        }
        return true;
      },
      theme: customTheme
    });

    if (QuestionAnswer.instance.isSupportFeature(AppConstant.AddFeature.Sentry)) {
      console.log('');
      QuestionAnswer.instance.setSentryDsnURL = await input({
        message: questionBuilder(
          colors,
          AppConstant.StringConstants.sentryDsnURLQuestion,
          AppConstant.StringConstants.sentryDsnURLQuestionHelp
        ),
        required: true,
        default: AppConstant.StringConstants.sentryDsnURLDefault,
        /**
         *
         */
        validate: (value = '') => {
          if (_.isEmpty(value)) {
            return AppConstant.StringConstants.sentryDsnURLRequired;
          } else if (!/^[^\s].*$/.test(value)) {
            return AppConstant.StringConstants.sentryDsnURLStartWithSpace;
          } else if (!/^((http|https):\/\/)*/.test(value)) {
            return AppConstant.StringConstants.sentryDsnURLInvalid;
          }
          return true;
        },
        theme: customTheme
      });

      console.log('');
      QuestionAnswer.instance.setSentryOrgSlug = await input({
        message: questionBuilder(
          colors,
          AppConstant.StringConstants.sentryOrgSlugQuestion,
          AppConstant.StringConstants.sentryOrgSlugQuestionHelp
        ),
        required: true,
        default: AppConstant.StringConstants.sentryOrgSlugDefault,
        /**
         *
         */
        validate: (value = '') => {
          if (_.isEmpty(value)) {
            return AppConstant.StringConstants.sentryOrgSlugRequired;
          } else if (!/^[^\s].*$/.test(value)) {
            return AppConstant.StringConstants.sentryOrgSlugStartWithSpace;
          }
          return true;
        },
        theme: customTheme
      });

      console.log('');
      QuestionAnswer.instance.setSentryOrgProject = await input({
        message: questionBuilder(
          colors,
          AppConstant.StringConstants.sentryOrgProjectQuestion,
          AppConstant.StringConstants.sentryOrgProjectQuestionHelp
        ),
        required: true,
        default: AppConstant.StringConstants.sentryOrgProjectDefault,
        /**
         *
         */
        validate: (value = '') => {
          if (_.isEmpty(value)) {
            return AppConstant.StringConstants.sentryOrgProjectRequired;
          } else if (!/^[^\s].*$/.test(value)) {
            return AppConstant.StringConstants.sentryOrgProjectStartWithSpace;
          }
          return true;
        },
        theme: customTheme
      });

      console.log('');
      QuestionAnswer.instance.setSentryAuthToken = await input({
        message: questionBuilder(
          colors,
          AppConstant.StringConstants.sentryAuthTokenQuestion,
          AppConstant.StringConstants.sentryAuthTokenQuestionHelp
        ),
        required: true,
        default: AppConstant.StringConstants.sentryAuthTokenDefault,
        /**
         *
         */
        validate: (value = '') => {
          if (_.isEmpty(value)) {
            return AppConstant.StringConstants.sentryAuthTokenRequired;
          } else if (!/^[^\s].*$/.test(value)) {
            return AppConstant.StringConstants.sentryAuthTokenStartWithSpace;
          }
          return true;
        },
        theme: customTheme
      });
    }

    console.log('');
    QuestionAnswer.instance.setSetupEnv = await checkbox({
      message: questionBuilder(
        colors,
        AppConstant.StringConstants.setupEnvQuestion,
        AppConstant.StringConstants.setupEnvQuestionHelp
      ),
      required: true,
      choices: AppConstant.StringConstants.setupEnvChoices,
      /**
       *
       */
      validate: (value) => {
        if (_.size(value) <= 0) {
          return AppConstant.StringConstants.setupEnvRequired;
        }
        return true;
      },
      theme: customTheme
    });

    console.log('');
    QuestionAnswer.instance.setSupportSampleBundle = await confirm({
      message: questionBuilder(colors, AppConstant.StringConstants.supportSampleBundleQuestion),
      default: AppConstant.StringConstants.supportSampleBundleDefault,
      theme: customTheme
    });

    console.log('');
    QuestionAnswer.instance.setRepositoryLink = await input({
      message: questionBuilder(
        colors,
        AppConstant.StringConstants.repositoryLinkQuestion,
        AppConstant.StringConstants.repositoryLinkQuestionHelp
      ),
      required: true,
      default: AppConstant.StringConstants.repositoryLinkDefault,
      /**
       *
       */
      validate: (value = '') => {
        if (_.isEmpty(value)) {
          return AppConstant.StringConstants.repositoryLinkRequired;
        } else if (!/^[^\s].*$/.test(value)) {
          return AppConstant.StringConstants.repositoryLinkStartWithSpace;
        } else if (!/^((http|https):\/\/)*/.test(value)) {
          return AppConstant.StringConstants.repositoryLinkInvalid;
        }
        return true;
      },
      theme: customTheme
    });
  } catch (error) {
    showError(error, spinner, colors);
  }
};
