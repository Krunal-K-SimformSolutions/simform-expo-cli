import { questionBuilder, stringBuilder } from '@/utils';
import { input, number, select, checkbox, confirm } from '@inquirer/prompts';
import { type Theme } from '@inquirer/core';
import type { PartialDeep } from '@inquirer/type';
import _ from 'lodash';
import { QuestionAnswer } from './QuestionAnswer';

const customTheme: PartialDeep<Theme> = {
  prefix: {
    done: stringBuilder({ text: '✔', color: 'greenBright' }),
    idle: stringBuilder({ text: '#', color: 'blueBright' }),
    loading: stringBuilder({ text: '...', color: 'yellowBright' })
  },
  spinner: {
    interval: 80,
    frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
  },
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
      `What's your project name?\nProject directory and package name will be created based on this.`,
      `Must use a first upper letter followed by one or more of (A-Z, a-z, 0-9).`
    ),
    required: true,
    default: 'ProjectName',
    validate: (value = '') => {
      if (_.isEmpty(value)) {
        return 'Project name is required.';
      } else if (!/^[^\s].*$/.test(value)) {
        return 'Project name cannot start with a space.';
      } else if (!/^[A-Z][a-zA-Z0-9]+$/.test(value)) {
        return 'Project name must use a first upper letter followed by one or more of (A-Z, a-z, 0-9).';
      }
      return true;
    },
    theme: customTheme
  });

  QuestionAnswer.instance.setBundleIdentifier = await input({
    message: questionBuilder(
      `What's your project bundle identifier or package name?\nPackage directory will be created based on this.`,
      `Must use a letter followed by one or more of (A-Z, a-z, 0-9, .).`
    ),
    required: true,
    default: `com.simform.${QuestionAnswer.instance.getProjectNameWithLowerCase}`,
    validate: (value = '') => {
      if (_.isEmpty(value)) {
        return 'Bundle identifier is required.';
      } else if (!/^[^\s].*$/.test(value)) {
        return 'Bundle identifier cannot start with a blank character.';
      } else if (!/^[a-zA-Z0-9.]+$/.test(value)) {
        return 'Bundle identifier must use a letter followed by one or more of (A-Z, a-z, 0-9, .).';
      }
      return true;
    },
    theme: customTheme
  });

  QuestionAnswer.instance.setMinAndroidSdkVersion = await number({
    message: questionBuilder(
      `What's your project minimum SDK version for Android platform?`,
      `Must use a digit followed by one or more of (0-9, -).`
    ),
    min: 1,
    max: 100,
    step: 1,
    default: 24,
    required: true,
    validate: (value) => {
      if (value === undefined) {
        return 'Android SDK version is required.';
      } else if (!/^[^\s].*$/.test(String(value))) {
        return 'Android SDK version cannot start with a blank character.';
      } else if (!/^[0-9-]+$/.test(String(value))) {
        return 'Android SDK version must use a digit followed by one or more of (0-9, -).';
      } else if (Number(value) <= 0) {
        return 'Android SDK version must be a grater than zero';
      }
      return true;
    },
    theme: customTheme
  });

  QuestionAnswer.instance.setMinIOSSdkVersion = await number({
    message: questionBuilder(
      `What's your project minimum SDK version for IOS platform?`,
      `Must use a digit followed by one or more of (0-9, -, .).`
    ),
    min: 1,
    max: 100,
    step: 0.01,
    default: 15.0,
    required: true,
    validate: (value) => {
      if (value === undefined) {
        return 'IOS SDK version is required.';
      } else if (!/^[^\s].*$/.test(String(value))) {
        return 'IOS SDK version cannot start with a blank character.';
      } else if (!/^[0-9-.]+$/.test(String(value))) {
        return 'IOS SDK version must use a digit followed by one or more of (0-9, -, .).';
      } else if (Number(value) <= 0) {
        return 'IOS SDK version must be a grater than zero';
      }
      return true;
    },
    theme: customTheme
  });

  QuestionAnswer.instance.setSupportEAS = await confirm({
    message: questionBuilder(`Do you want to use Expo Application Services (EAS)?`),
    default: false,
    theme: customTheme
  });

  if (QuestionAnswer.instance.getSupportEAS) {
    QuestionAnswer.instance.setProjectID = await input({
      message: questionBuilder(
        `What's your project ID?\nBased on this initialize your Expo Application Services.`,
        `For Example: "72d99451-bf93-4551-9f49-68c813995d3c"`
      ),
      required: true,
      default: '',
      validate: (value = '') => {
        if (_.isEmpty(value)) {
          return 'Project ID is required.';
        } else if (!/^[^\s].*$/.test(value)) {
          return 'Project ID cannot start with a space.';
        }
        return true;
      },
      theme: customTheme
    });

    QuestionAnswer.instance.setProjectSlug = await input({
      message: questionBuilder(
        `What's your project Slug?\nBased on this initialize your Expo Application Services.`,
        `For Example: "sample-demo"`
      ),
      required: true,
      default: '',
      validate: (value = '') => {
        if (_.isEmpty(value)) {
          return 'Project Slug is required.';
        } else if (!/^[^\s].*$/.test(value)) {
          return 'Project Slug cannot start with a space.';
        }
        return true;
      },
      theme: customTheme
    });
  }

  QuestionAnswer.instance.setStateManagement = await select({
    message: questionBuilder(
      `Which state management tool do you want to use?`,
      `For React-Redux, we will use the Toolkit.`
    ),
    choices: [
      {
        name: 'React Redux',
        value: 'ReactRedux',
        description: 'React Redux with Toolkit'
      },
      {
        name: 'GraphQL',
        value: 'GraphQL',
        description: 'GraphQL with Apollo Client'
      }
    ],
    default: 'ReactRedux',
    theme: customTheme
  });

  if (QuestionAnswer.instance.isReactReduxStateManagement) {
    QuestionAnswer.instance.setStateManagementMiddleware = await select({
      message: questionBuilder(
        `Which middleware tool do you want to use with React Redux state management?`
      ),
      choices: [
        {
          name: 'Redux Thunk',
          value: 'ReduxThunk',
          description: 'Toolkit with Redux Thunk'
        },
        {
          name: 'Redux Saga',
          value: 'ReduxSaga',
          description: 'Toolkit with Redux Saga'
        }
      ],
      default: 'ReduxThunk',
      theme: customTheme
    });

    QuestionAnswer.instance.setApiMiddleware = await checkbox({
      message: questionBuilder(`Which middleware tool do you want to use when API call?`),
      required: true,
      choices: [
        {
          name: 'Axios',
          value: 'Axios',
          checked: true,
          description: 'Axios with React Native'
        },
        {
          name: 'Fetch',
          value: 'Fetch',
          checked: false,
          description: 'Fetch with React Native'
        },
        {
          name: 'AWS Amplify',
          value: 'AWSAmplify',
          checked: false,
          description: 'AWS Amplify with React Native'
        }
      ],
      validate: (value) => {
        if (_.size(value) <= 0) {
          return 'Select at least one API middleware.';
        }
        return true;
      },
      theme: customTheme
    });

    QuestionAnswer.instance.setApiBaseURL = await input({
      message: questionBuilder(
        `What's your project API endpoint?.`,
        `Must use a start with http or https followed by one or more of (A-Z, a-z, 0-9, symbol).`
      ),
      required: true,
      default: 'https://reqres.in/',
      validate: (value = '') => {
        if (_.isEmpty(value)) {
          return 'API endpoint is required.';
        } else if (!/^[^\s].*$/.test(value)) {
          return 'API endpoint cannot start with a blank character.';
        } else if (!/^((http|https):\/\/)*/.test(value)) {
          return 'API endpoint must start with http or https.';
        }
        return true;
      },
      theme: customTheme
    });
  }

  QuestionAnswer.instance.setAddFeatures = await checkbox({
    message: questionBuilder(`Which feature do you want to configure when the project is created?`),
    required: true,
    choices: [
      {
        name: 'Sentry',
        value: 'Sentry',
        checked: true,
        description: 'Sentry with React Native'
      },
      {
        name: 'Translations',
        value: 'Translations',
        checked: false,
        description: 'Translations with i18next'
      },
      {
        name: 'EsLint',
        value: 'EsLint',
        checked: false,
        description: 'EsLint'
      },
      {
        name: 'Prettier',
        value: 'Prettier',
        checked: false,
        description: 'Prettier'
      },
      {
        name: 'CSpell',
        value: 'CSpell',
        checked: false,
        description: 'CSpell'
      },
      {
        name: 'LeftHook',
        value: 'LeftHook',
        checked: false,
        description: 'LeftHook'
      }
    ],
    validate: (value) => {
      if (_.size(value) <= 0) {
        return 'Select at least one feature.';
      }
      return true;
    },
    theme: customTheme
  });

  if (QuestionAnswer.instance.isSupportFeature('Sentry')) {
    QuestionAnswer.instance.setSentryDsnURL = await input({
      message: questionBuilder(
        `What's your project sentry DSN URL?\nBased on this initialize your crashlytics tool(Sentry).`,
        `Must use a start with http or https followed by one or more of (A-Z, a-z, 0-9, symbol).`
      ),
      required: true,
      default: '',
      validate: (value = '') => {
        if (_.isEmpty(value)) {
          return 'Sentry DSN URL is required.';
        } else if (!/^[^\s].*$/.test(value)) {
          return 'Sentry DSN URL cannot start with a blank character.';
        } else if (!/^((http|https):\/\/)*/.test(value)) {
          return 'Sentry DSN URL must start with http or https.';
        }
        return true;
      },
      theme: customTheme
    });

    QuestionAnswer.instance.setSentryOrgSlug = await input({
      message: questionBuilder(
        `What's your project sentry organization slug?\nBased on this initialize your crashlytics tool(Sentry).`,
        `For Example: "simform"`
      ),
      required: true,
      default: '',
      validate: (value = '') => {
        if (_.isEmpty(value)) {
          return 'Sentry organization slug is required.';
        } else if (!/^[^\s].*$/.test(value)) {
          return 'Sentry organization slug cannot start with a blank character.';
        }
        return true;
      },
      theme: customTheme
    });

    QuestionAnswer.instance.setSentryOrgProject = await input({
      message: questionBuilder(
        `What's your sentry organization project?\nBased on this initialize your crashlytics tool(Sentry).`,
        `For Example: "sample-demo"`
      ),
      required: true,
      default: '',
      validate: (value = '') => {
        if (_.isEmpty(value)) {
          return 'Sentry organization project is required.';
        } else if (!/^[^\s].*$/.test(value)) {
          return 'Sentry organization project cannot start with a blank character.';
        }
        return true;
      },
      theme: customTheme
    });

    QuestionAnswer.instance.setSentryAuthToken = await input({
      message: questionBuilder(
        `What's your project sentry auth token?\nBased on this initialize your crashlytics tool(Sentry).`,
        `For Example: "0a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"`
      ),
      required: true,
      default: '',
      validate: (value = '') => {
        if (_.isEmpty(value)) {
          return 'Sentry auth token is required.';
        } else if (!/^[^\s].*$/.test(value)) {
          return 'Sentry auth token cannot start with a blank character.';
        }
        return true;
      },
      theme: customTheme
    });
  }

  QuestionAnswer.instance.setSetupEnv = await checkbox({
    message: questionBuilder(
      `What's your project environment?\nBased on this initialize your project environment setup.`,
      `For Example: ["dev", "prod", "stage", "qa"]`
    ),
    required: true,
    choices: [
      {
        name: 'Development',
        value: 'development',
        checked: true,
        description: 'Development environment'
      },
      {
        name: 'Production',
        value: 'production',
        checked: true,
        description: 'Production environment'
      },
      {
        name: 'Staging',
        value: 'staging',
        checked: false,
        description: 'Staging environment'
      },
      {
        name: 'QA',
        value: 'qa',
        checked: false,
        description: 'QA environment'
      }
    ],
    validate: (value) => {
      if (_.size(value) <= 0) {
        return 'Select at least one environment.';
      }
      return true;
    },
    theme: customTheme
  });

  QuestionAnswer.instance.setSupportSampleBundle = await confirm({
    message: questionBuilder(
      `Do you want to use same bundle identifier for all supported environments?`
    ),
    default: false,
    theme: customTheme
  });

  QuestionAnswer.instance.setRepositoryLink = await input({
    message: questionBuilder(
      `What's your project remote repository URL?\nBased on this initialize your source code management tool(Git)`,
      `Must use a start with git, http or https followed by one or more of (A-Z, a-z, 0-9, symbol).`
    ),
    required: true,
    default: 'https://',
    validate: (value = '') => {
      if (_.isEmpty(value)) {
        return 'Remote repository URL is required.';
      } else if (!/^[^\s].*$/.test(value)) {
        return 'Remote repository URL cannot start with a blank character.';
      } else if (!/^((http|https):\/\/)*/.test(value)) {
        return 'Remote repository URL must start with http or https.';
      }
      return true;
    },
    theme: customTheme
  });
};
