import { questionBuilder, stringBuilder } from '@/utils';
import { input, number, select, checkbox, confirm } from '@inquirer/prompts';
import { type Theme } from '@inquirer/core';
import type { PartialDeep } from '@inquirer/type';
import _ from 'lodash';
import { QuestionAnswer } from './QuestionAnswer';
import AppConstant from '@/AppConstant';

const customTheme: PartialDeep<Theme> = {
  prefix: {
    done: stringBuilder({ text: '✔', color: 'greenBright' }),
    idle: stringBuilder({ text: '#', color: 'blueBright' }),
    loading: stringBuilder({ text: '...', color: 'yellowBright' })
  },
  spinner: AppConstant.SpinnerConstants,
  style: {
    answer: (text: string) => stringBuilder({ text: text, color: 'cyanBright' }),
    message: (text: string) => stringBuilder({ text: text, color: 'yellowBright' }),
    error: (text: string) => stringBuilder({ text: `> ${text}`, color: 'redBright' }),
    defaultAnswer: (text: string) =>
      stringBuilder({ text: text, color: 'greenBright', modifiers: 'bold' }),
    help: (text: string) => stringBuilder({ text: text, color: 'greenBright', modifiers: 'dim' }),
    highlight: (text: string) => stringBuilder({ text: text, color: 'cyanBright' }),
    key: (text: string) =>
      stringBuilder({ text: `<${text}>`, color: 'cyanBright', modifiers: 'bold' })
  }
};

export const askQuestions = async () => {
  QuestionAnswer.instance.setProjectName = await input({
    message: questionBuilder(
      AppConstant.StringConstants.projectNameQuestion,
      AppConstant.StringConstants.projectNameQuestionHelp
    ),
    required: true,
    default: AppConstant.StringConstants.projectNameDefault,
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

  QuestionAnswer.instance.setBundleIdentifier = await input({
    message: questionBuilder(
      AppConstant.StringConstants.bundleIdentifierQuestion,
      AppConstant.StringConstants.bundleIdentifierQuestionHelp
    ),
    required: true,
    default: AppConstant.StringConstants.bundleIdentifierDefault(
      QuestionAnswer.instance.getProjectNameWithLowerCase
    ),
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

  QuestionAnswer.instance.setMinAndroidSdkVersion = await number({
    message: questionBuilder(
      AppConstant.StringConstants.minAndroidSdkVersionQuestion,
      AppConstant.StringConstants.minAndroidSdkVersionQuestionHelp
    ),
    min: 1,
    max: 100,
    step: 1,
    default: AppConstant.StringConstants.minAndroidSdkVersionDefault,
    required: true,
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

  QuestionAnswer.instance.setMinIOSSdkVersion = await number({
    message: questionBuilder(
      AppConstant.StringConstants.minIosSdkVersionQuestion,
      AppConstant.StringConstants.minIosSdkVersionQuestionHelp
    ),
    min: 1,
    max: 100,
    step: 0.01,
    default: AppConstant.StringConstants.minIosSdkVersionDefault,
    required: true,
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

  QuestionAnswer.instance.setSupportEAS = await confirm({
    message: questionBuilder(AppConstant.StringConstants.supportEASQuestion),
    default: AppConstant.StringConstants.supportEASDefault,
    theme: customTheme
  });

  if (QuestionAnswer.instance.getSupportEAS) {
    QuestionAnswer.instance.setProjectID = await input({
      message: questionBuilder(
        AppConstant.StringConstants.easProjectIdQuestion,
        AppConstant.StringConstants.easProjectIdQuestionHelp
      ),
      required: true,
      default: AppConstant.StringConstants.easProjectIdDefault,
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

    QuestionAnswer.instance.setProjectSlug = await input({
      message: questionBuilder(
        AppConstant.StringConstants.easProjectSlugQuestion,
        AppConstant.StringConstants.easProjectSlugQuestionHelp
      ),
      required: true,
      default: AppConstant.StringConstants.easProjectSlugDefault,
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

  QuestionAnswer.instance.setStateManagement = await select({
    message: questionBuilder(
      AppConstant.StringConstants.stateManagementQuestion,
      AppConstant.StringConstants.stateManagementQuestionHelp
    ),
    choices: AppConstant.StringConstants.stateManagementChoices,
    default: AppConstant.StateManagement.ReactRedux,
    theme: customTheme
  });

  if (QuestionAnswer.instance.isReactReduxStateManagement) {
    QuestionAnswer.instance.setStateManagementMiddleware = await select({
      message: questionBuilder(AppConstant.StringConstants.stateManagementMiddlewareQuestion),
      choices: AppConstant.StringConstants.stateManagementMiddlewareChoices,
      default: AppConstant.StateManagementMiddleware.ReduxThunk,
      theme: customTheme
    });

    QuestionAnswer.instance.setApiMiddleware = await checkbox({
      message: questionBuilder(AppConstant.StringConstants.apiMiddlewareQuestion),
      required: true,
      choices: AppConstant.StringConstants.apiMiddlewareChoices,
      validate: (value) => {
        if (_.size(value) <= 0) {
          return AppConstant.StringConstants.apiMiddlewareRequired;
        }
        return true;
      },
      theme: customTheme
    });

    QuestionAnswer.instance.setApiBaseURL = await input({
      message: questionBuilder(
        AppConstant.StringConstants.apiBaseURLQuestion,
        AppConstant.StringConstants.apiBaseURLQuestionHelp
      ),
      required: true,
      default: AppConstant.StringConstants.apiBaseURLDefault,
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

  QuestionAnswer.instance.setAddFeatures = await checkbox({
    message: questionBuilder(AppConstant.StringConstants.addFeatureQuestion),
    required: true,
    choices: AppConstant.StringConstants.addFeatureChoices,
    validate: (value) => {
      if (_.size(value) <= 0) {
        return AppConstant.StringConstants.addFeatureRequired;
      }
      return true;
    },
    theme: customTheme
  });

  if (QuestionAnswer.instance.isSupportFeature(AppConstant.AddFeature.Sentry)) {
    QuestionAnswer.instance.setSentryDsnURL = await input({
      message: questionBuilder(
        AppConstant.StringConstants.sentryDsnURLQuestion,
        AppConstant.StringConstants.sentryDsnURLQuestionHelp
      ),
      required: true,
      default: AppConstant.StringConstants.sentryDsnURLDefault,
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

    QuestionAnswer.instance.setSentryOrgSlug = await input({
      message: questionBuilder(
        AppConstant.StringConstants.sentryOrgSlugQuestion,
        AppConstant.StringConstants.sentryOrgSlugQuestionHelp
      ),
      required: true,
      default: AppConstant.StringConstants.sentryOrgSlugDefault,
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

    QuestionAnswer.instance.setSentryOrgProject = await input({
      message: questionBuilder(
        AppConstant.StringConstants.sentryOrgProjectQuestion,
        AppConstant.StringConstants.sentryOrgProjectQuestionHelp
      ),
      required: true,
      default: AppConstant.StringConstants.sentryOrgProjectDefault,
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

    QuestionAnswer.instance.setSentryAuthToken = await input({
      message: questionBuilder(
        AppConstant.StringConstants.sentryAuthTokenQuestion,
        AppConstant.StringConstants.sentryAuthTokenQuestionHelp
      ),
      required: true,
      default: AppConstant.StringConstants.sentryAuthTokenDefault,
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

  QuestionAnswer.instance.setSetupEnv = await checkbox({
    message: questionBuilder(
      AppConstant.StringConstants.setupEnvQuestion,
      AppConstant.StringConstants.setupEnvQuestionHelp
    ),
    required: true,
    choices: AppConstant.StringConstants.setupEnvChoices,
    validate: (value) => {
      if (_.size(value) <= 0) {
        return AppConstant.StringConstants.setupEnvRequired;
      }
      return true;
    },
    theme: customTheme
  });

  QuestionAnswer.instance.setSupportSampleBundle = await confirm({
    message: questionBuilder(AppConstant.StringConstants.supportSampleBundleQuestion),
    default: AppConstant.StringConstants.supportSampleBundleDefault,
    theme: customTheme
  });

  QuestionAnswer.instance.setRepositoryLink = await input({
    message: questionBuilder(
      AppConstant.StringConstants.repositoryLinkQuestion,
      AppConstant.StringConstants.repositoryLinkQuestionHelp
    ),
    required: true,
    default: AppConstant.StringConstants.repositoryLinkDefault,
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
};
