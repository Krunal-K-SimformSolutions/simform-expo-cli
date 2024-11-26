const PackageManager = {
  Npm: 'npm',
  Yarn: 'yarn',
  Pnpm: 'pnpm'
} as const;

const StateManagement = {
  ReactRedux: 'ReactRedux',
  GraphQL: 'GraphQL'
} as const;

const StateManagementMiddleware = {
  ReduxThunk: 'ReduxThunk',
  ReduxSaga: 'ReduxSaga'
} as const;

const ApiMiddleware = {
  Axios: 'Axios',
  Fetch: 'Fetch',
  AWSAmplify: 'AWSAmplify'
} as const;

const AddFeature = {
  Sentry: 'Sentry',
  Translations: 'Translations',
  EsLint: 'EsLint',
  Prettier: 'Prettier',
  CSpell: 'CSpell',
  LeftHook: 'LeftHook',
  Socket: 'Socket'
} as const;

const SetupEnv = {
  Development: 'development',
  Production: 'production',
  Preview: 'preview'
} as const;

const SpinnerConstants = {
  interval: 80,
  frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
};

const StringConstants = Object.freeze({
  simformTitle: 'Simform Solutions LLP',
  welcome: 'Welcome to the Expo boilerplate framework.',
  welcomeProject: 'Start building your app with ease!\n\n',
  packageManagerQuestion: 'Which package manager are you using?',
  packageManagerDefault: PackageManager.Yarn,
  packageManagerChoices: [
    {
      name: 'Npm',
      value: PackageManager.Npm,
      description: 'Node Package Manager'
    },
    {
      name: 'Yarn',
      value: PackageManager.Yarn,
      description: 'Yarn Package Manager'
    },
    {
      name: 'Pnpm',
      value: PackageManager.Pnpm,
      description: 'Fast, disk space efficient package manager'
    }
  ],
  projectNameQuestion:
    "What's your project name?\nProject directory and package name will be created based on this.",
  projectNameQuestionHelp:
    'Must use a first upper letter followed by one or more of (A-Z, a-z, 0-9).',
  projectNameDefault: 'ProjectName',
  projectNameRequired: 'Project name is required.',
  projectNameStartWithSpace: 'Project name cannot start with a space.',
  projectNameInvalid:
    'Project name must use a first upper letter followed by one or more of (A-Z, a-z, 0-9).',
  bundleIdentifierQuestion:
    "What's your project bundle identifier or package name?\nPackage directory will be created based on this.",
  bundleIdentifierQuestionHelp: 'Must use a letter followed by one or more of (A-Z, a-z, 0-9, .).',
  /**
   *
   */
  bundleIdentifierDefault: (packageName: string) => `com.simform.${packageName}`,
  bundleIdentifierRequired: 'Bundle identifier is required.',
  bundleIdentifierStartWithSpace: 'Bundle identifier cannot start with a blank character.',
  bundleIdentifierInvalid:
    'Bundle identifier must use a letter followed by one or more of (A-Z, a-z, 0-9, .).',
  minAndroidSdkVersionQuestion: "What's your project minimum SDK version for Android platform?",
  minAndroidSdkVersionQuestionHelp: 'Must use a digit followed by one or more of (0-9, -).',
  minAndroidSdkVersionDefault: 24,
  minAndroidSdkVersionRequired: 'Android SDK version is required.',
  minAndroidSdkVersionStartWithSpace: 'Android SDK version cannot start with a blank character.',
  minAndroidSdkVersionDigit:
    'Android SDK version must use a digit followed by one or more of (0-9, -).',
  minAndroidSdkVersionInvalid: 'Android SDK version must be a grater than zero',
  minIosSdkVersionQuestion: "What's your project minimum SDK version for IOS platform?",
  minIosSdkVersionQuestionHelp: 'Must use a digit followed by one or more of (0-9, -, .).',
  minIosSdkVersionDefault: 16.0,
  minIosSdkVersionRequired: 'IOS SDK version is required.',
  minIosSdkVersionStartWithSpace: 'IOS SDK version cannot start with a blank character.',
  minIosSdkVersionDigit: 'IOS SDK version must use a digit followed by one or more of (0-9, -, .).',
  minIosSdkVersionInvalid: 'IOS SDK version must be a grater than zero',
  supportEASQuestion: 'Do you want to use Expo Application Services (EAS)?',
  supportEASDefault: false,
  easProjectIdQuestion:
    "What's your project ID?\nBased on this initialize your Expo Application Services.",
  easProjectIdQuestionHelp: 'For Example: "72d99451-bf93-4551-9f49-68c813995d3c"',
  easProjectIdDefault: '',
  easProjectIdRequired: 'Project ID is required.',
  easProjectIdStartWithSpace: 'Project ID cannot start with a space.',
  easProjectSlugQuestion:
    "What's your project Slug?\nBased on this initialize your Expo Application Services.",
  easProjectSlugQuestionHelp: 'For Example: "sample-demo"',
  easProjectSlugDefault: '',
  easProjectSlugRequired: 'Project Slug is required.',
  easProjectSlugStartWithSpace: 'Project Slug cannot start with a space.',
  stateManagementQuestion: 'Which state management tool do you want to use?',
  stateManagementQuestionHelp: 'For React-Redux, we will use the Toolkit.',
  stateManagementChoices: [
    {
      name: 'React Redux',
      value: StateManagement.ReactRedux,
      description: 'React Redux with Toolkit'
    },
    {
      name: 'GraphQL',
      value: StateManagement.GraphQL,
      description: 'GraphQL with Apollo Client'
    }
  ],
  stateManagementMiddlewareQuestion:
    'Which middleware tool do you want to use with React Redux state management?',
  stateManagementMiddlewareChoices: [
    {
      name: 'Redux Thunk',
      value: StateManagementMiddleware.ReduxThunk,
      description: 'Toolkit with Redux Thunk'
    },
    {
      name: 'Redux Saga',
      value: StateManagementMiddleware.ReduxSaga,
      description: 'Toolkit with Redux Saga'
    }
  ],
  apiMiddlewareQuestion: 'Which middleware tool do you want to use when API call?',
  apiMiddlewareChoices: [
    {
      name: 'Axios',
      value: ApiMiddleware.Axios,
      checked: true,
      description: 'Axios with React Native'
    },
    {
      name: 'Fetch',
      value: ApiMiddleware.Fetch,
      checked: false,
      description: 'Fetch with React Native'
    },
    {
      name: 'AWS Amplify',
      value: ApiMiddleware.AWSAmplify,
      checked: false,
      description: 'AWS Amplify with React Native'
    }
  ],
  apiMiddlewareRequired: 'Select at least one middleware tool.',
  apiBaseURLQuestion: "What's your project API endpoint?.",
  apiBaseURLQuestionHelp:
    'Must use a start with http or https followed by one or more of (A-Z, a-z, 0-9, symbol).',
  apiBaseURLDefault: 'https://reqres.in/',
  apiBaseURLRequired: 'API endpoint is required.',
  apiBaseURLStartWithSpace: 'API endpoint cannot start with a blank character.',
  apiBaseURLInvalid: 'API endpoint must start with http or https.',
  addFeatureQuestion: 'Which feature do you want to configure when the project is created?',
  addFeatureChoices: [
    {
      name: 'Sentry',
      value: AddFeature.Sentry,
      checked: true,
      description: 'Handle crashlytics with Sentry'
    },
    {
      name: 'Translations',
      value: AddFeature.Translations,
      checked: true,
      description: 'Support multiple languages'
    },
    {
      name: 'EsLint',
      value: AddFeature.EsLint,
      checked: true,
      description: 'Static code analysis with EsLint'
    },
    {
      name: 'Prettier',
      value: AddFeature.Prettier,
      checked: true,
      description: 'Format code with Prettier'
    },
    {
      name: 'CSpell',
      value: AddFeature.CSpell,
      checked: true,
      description: 'Spell check with CSpell'
    },
    {
      name: 'LeftHook',
      value: AddFeature.LeftHook,
      checked: true,
      description: 'Pre-commit hooks with LeftHook'
    },
    {
      name: 'Socket',
      value: AddFeature.Socket,
      checked: false,
      description: 'Real-time communication with Socket'
    }
  ],
  addFeatureRequired: 'Select at least one feature.',
  sentryDsnURLQuestion:
    "What's your project sentry DSN URL?\nBased on this initialize your crashlytics tool(Sentry).",
  sentryDsnURLQuestionHelp:
    'Must use a start with http or https followed by one or more of (A-Z, a-z, 0-9, symbol).',
  sentryDsnURLDefault: '',
  sentryDsnURLRequired: 'Sentry DSN URL is required.',
  sentryDsnURLStartWithSpace: 'Sentry DSN URL cannot start with a blank character.',
  sentryDsnURLInvalid: 'Sentry DSN URL must start with http or https.',
  sentryOrgSlugQuestion:
    "What's your project sentry organization slug?\nBased on this initialize your crashlytics tool(Sentry).",
  sentryOrgSlugQuestionHelp: 'For Example: "simform"',
  sentryOrgSlugDefault: '',
  sentryOrgSlugRequired: 'Sentry organization slug is required.',
  sentryOrgSlugStartWithSpace: 'Sentry organization slug cannot start with a blank character.',
  sentryOrgProjectQuestion:
    "What's your sentry organization project?\nBased on this initialize your crashlytics tool(Sentry).",
  sentryOrgProjectQuestionHelp: 'For Example: "sample-demo"',
  sentryOrgProjectDefault: '',
  sentryOrgProjectRequired: 'Sentry organization project is required.',
  sentryOrgProjectStartWithSpace:
    'Sentry organization project cannot start with a blank character.',
  sentryAuthTokenQuestion:
    "What's your project sentry auth token?\nBased on this initialize your crashlytics tool(Sentry).",
  sentryAuthTokenQuestionHelp: 'For Example: "0a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"',
  sentryAuthTokenDefault: '',
  sentryAuthTokenRequired: 'Sentry auth token is required.',
  sentryAuthTokenStartWithSpace: 'Sentry auth token cannot start with a blank character.',
  setupEnvQuestion:
    "What's your project environment?\nBased on this initialize your project environment setup.",
  setupEnvQuestionHelp: 'For Example: "development, preview, production"',
  setupEnvChoices: [
    {
      name: 'Development',
      value: SetupEnv.Development,
      checked: true,
      description: 'Development environment'
    },
    {
      name: 'Production',
      value: SetupEnv.Production,
      checked: true,
      disabled: '(Production is always available)',
      description: 'Production environment'
    },
    {
      name: 'Preview',
      value: SetupEnv.Preview,
      checked: false,
      description: 'Preview environment'
    }
  ],
  setupEnvRequired: 'Select at least one environment.',
  supportSampleBundleQuestion:
    'Do you want to use same bundle identifier for all supported environments?',
  supportSampleBundleDefault: false,
  repositoryLinkQuestion:
    "What's your project remote repository URL?\nBased on this initialize your source code management tool(Git)",
  repositoryLinkQuestionHelp:
    'Must use a start with git, http or https followed by one or more of (A-Z, a-z, 0-9, symbol).',
  repositoryLinkDefault: 'https://',
  repositoryLinkRequired: 'Remote repository URL is required.',
  repositoryLinkStartWithSpace: 'Remote repository URL cannot start with a blank character.',
  repositoryLinkInvalid: 'Remote repository URL must start with http or https.',
  msgProjectTemplate: 'Generate Project Template',
  msgDependencyInstall: 'Installing Dependencies',
  msgNativeModules: 'Generate Native Modules',
  msgProjectSuccess: 'Happy Coding! 😊',
  /**
   *
   */
  msgProjectError: (message: string) => `Facing Error! (${message}) 🫣`,
  /**
   *
   */
  msgPackageManagerNotFount: (packageManager: string) =>
    `${packageManager} package manager not found ! please install it or select appropriate one.`,
  maxIndicatorInstance: 'You have reached the maximum number of 5 object references on Indicator'
});

export default Object.freeze({
  PackageManager,
  StateManagement,
  StateManagementMiddleware,
  ApiMiddleware,
  AddFeature,
  SetupEnv,
  SpinnerConstants,
  StringConstants
});
