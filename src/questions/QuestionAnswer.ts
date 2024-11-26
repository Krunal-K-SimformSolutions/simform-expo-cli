import { AppConstant } from '../constants/index.js';

type ObjectValueAsAType<T> = T[keyof T];

/**
 * This class definition is for a singleton class QuestionAnswer that stores and manages various
 * project settings and configurations. Here's a succinct explanation of what each class method does:
 */
export class QuestionAnswer {
  static #instance: QuestionAnswer;

  private packageManager: string = '';
  private projectName: string = '';
  private bundleIdentifier: string = '';
  private minAndroidSdkVersion: number = 0;
  private minIOSSdkVersion: number = 0.0;
  private supportEAS: boolean = false;
  private projectID: string = '';
  private projectSlug: string = '';
  private stateManagement: string = '';
  private stateManagementMiddleware: string = '';
  private apiMiddleware: Array<string> = [];
  private apiBaseURL: string = '';
  private addFeatures: Array<string> = [];
  private sentryDsnURL: string = '';
  private sentryOrgSlug: string = '';
  private sentryOrgProject: string = '';
  private sentryAuthToken: string = '';
  private setupEnv: Array<string> = [];
  private supportSampleBundle: boolean = false;
  private repositoryLink: string = '';

  /**
   * Constructs a new instance of the QuestionAnswer class.
   *
   * @remarks
   * This constructor is private. The QuestionAnswer class is a singleton class.
   * The instance is created only once on the first access to the static getter (instance).
   */
  private constructor() {}

  /**
   * Returns the singleton instance of the QuestionAnswer class.
   *
   * @remarks
   * The QuestionAnswer class is a singleton class. It can be accessed only through this static getter.
   * The instance is created only once on the first access to the getter.
   * @returns The singleton instance of the QuestionAnswer class.
   */
  public static get instance(): QuestionAnswer {
    if (!QuestionAnswer.#instance) {
      QuestionAnswer.#instance = new QuestionAnswer();
    }

    return QuestionAnswer.#instance;
  }

  /**
   * Returns the package manager used in the project.
   *
   * @remarks
   * The package manager is specified in the project's `package.json` file.
   * @returns The package manager used in the project.
   */
  get getPackageManager(): string {
    return this.packageManager;
  }

  /**
   * Checks if the specified package manager is supported.
   *
   * @param packageMng - The package manager to check.
   * @returns true if the package manager is supported, false otherwise.
   */
  public isSupportPackageManager(
    packageMng: ObjectValueAsAType<typeof AppConstant.PackageManager>
  ): boolean {
    return this.packageManager === packageMng;
  }

  /**
   * Sets the package manager used in the project.
   *
   * @param packageManager - The package manager to set.
   * @remarks
   * The package manager is specified in the project's `package.json` file.
   */
  set setPackageManager(packageManager: string) {
    this.packageManager = packageManager;
  }

  /**
   * Returns the project name.
   *
   * @remarks
   * The project name is used to generate the project directory and package name.
   * @returns The project name.
   */
  get getProjectName(): string {
    return this.projectName;
  }

  /**
   * Returns the project name with lower case letters.
   *
   * @remarks
   * The project name with lower case letters is used to generate the project directory and package name.
   * @returns The project name with lower case letters.
   */
  get getProjectNameWithLowerCase(): string {
    return this.projectName.toLowerCase();
  }

  /**
   * Sets the project name.
   *
   * @param projectName - The project name to set.
   * @remarks
   * The project name is used to generate the project directory and package name.
   */
  set setProjectName(projectName: string) {
    this.projectName = projectName;
  }

  /**
   * Returns the bundle identifier.
   *
   * @returns The bundle identifier.
   * @remarks
   * The bundle identifier is used to identify the app in the app store.
   */
  get getBundleIdentifier(): string {
    return this.bundleIdentifier;
  }

  /**
   * Sets the bundle identifier.
   *
   * @param bundleIdentifier - The bundle identifier to set.
   * @remarks
   * The bundle identifier is used to identify the app in the app store.
   */
  set setBundleIdentifier(bundleIdentifier: string) {
    this.bundleIdentifier = bundleIdentifier;
  }

  /**
   * Returns the minimum Android SDK version.
   *
   * @returns The minimum Android SDK version.
   * @remarks
   * The minimum Android SDK version is used to determine the minimum Android API level
   * that the app can run on.
   */
  get getMinAndroidSdkVersion(): number {
    return this.minAndroidSdkVersion;
  }

  /**
   * Sets the minimum Android SDK version.
   *
   * @param minAndroidSdkVersion - The minimum Android SDK version to set.
   * @remarks
   * The minimum Android SDK version is used to determine the minimum Android API level
   * that the app can run on.
   * If the value is not provided, the default value is 0.
   */
  set setMinAndroidSdkVersion(minAndroidSdkVersion: number | undefined) {
    this.minAndroidSdkVersion = minAndroidSdkVersion ?? 0;
  }

  /**
   * Returns the minimum iOS SDK version.
   *
   * @returns The minimum iOS SDK version.
   * @remarks
   * The minimum iOS SDK version is used to determine the minimum iOS version
   * that the app can run on.
   */
  get getMinIOSSdkVersion(): number {
    return this.minIOSSdkVersion;
  }

  /**
   * Sets the minimum iOS SDK version.
   *
   * @param minIOSSdkVersion - The minimum iOS SDK version to set.
   * @remarks
   * The minimum iOS SDK version is used to determine the minimum iOS version
   * that the app can run on.
   * If the value is not provided, the default value is 0.0.
   */
  set setMinIOSSdkVersion(minIOSSdkVersion: number | undefined) {
    this.minIOSSdkVersion = minIOSSdkVersion ?? 0.0;
  }

  /**
   * Returns whether to support EAS (Expo Application Services) or not.
   * @returns Whether to support EAS or not.
   * @remarks
   * If the value is true, the app will support EAS.
   * If the value is false, the app will not support EAS.
   * The default value is true.
   */
  get getSupportEAS(): boolean {
    return this.supportEAS;
  }

  /**
   * Sets whether to support EAS (Expo Application Services) or not.
   *
   * @param supportEAS - Whether to support EAS or not.
   * @remarks
   * If the value is true, the app will support EAS.
   * If the value is false, the app will not support EAS.
   * The default value is true.
   */
  set setSupportEAS(supportEAS: boolean) {
    this.supportEAS = supportEAS;
  }

  /**
   * Returns the project ID.
   *
   * @returns The project ID.
   * @remarks
   * The project ID is a unique identifier for the project.
   * It is used to identify the project in the Expo ecosystem.
   */
  get getProjectID(): string {
    return this.projectID;
  }

  /**
   * Sets the project ID.
   *
   * @param projectID - The project ID to set.
   * @remarks
   * The project ID is a unique identifier for the project.
   * It is used to identify the project in the Expo ecosystem.
   */
  set setProjectID(projectID: string) {
    this.projectID = projectID;
  }

  /**
   * Returns the project slug.
   *
   * @returns The project slug.
   * @remarks
   * The project slug is used to generate the project directory and package name.
   */
  get getProjectSlug(): string {
    return this.projectSlug;
  }

  /**
   * Sets the project slug.
   *
   * @param projectSlug - The project slug to set.
   * @remarks
   * The project slug is used to generate the project directory and package name.
   */
  set setProjectSlug(projectSlug: string) {
    this.projectSlug = projectSlug;
  }

  /**
   * Returns the state management tool used in the project.
   *
   * @returns The state management tool used in the project.
   * @remarks
   * The state management tool is specified in the project's `package.json` file.
   * It is used to initialize the project configuration.
   */
  get getStateManagement(): string {
    return this.stateManagement;
  }

  /**
   * Checks if the specified state management tool is supported.
   *
   * @param states - The state management tool to check.
   * @returns true if the state management tool is supported, false otherwise.
   */
  public isSupportStateManagement(
    states: ObjectValueAsAType<typeof AppConstant.StateManagement>
  ): boolean {
    return this.stateManagement === states;
  }

  /**
   * Sets the state management tool used in the project.
   *
   * @param stateManagement - The state management tool to set.
   * @remarks
   * The state management tool is specified in the project's `package.json` file.
   * It is used to initialize the project configuration.
   */
  set setStateManagement(stateManagement: string) {
    this.stateManagement = stateManagement;
  }

  /**
   * Returns the state management middleware used in the project.
   *
   * @returns The state management middleware used in the project.
   * @remarks
   * The state management middleware is specified in the project's `package.json` file.
   * It is used to initialize the project configuration.
   */
  get getStateManagementMiddleware(): string {
    return this.stateManagementMiddleware;
  }

  /**
   * Checks if the specified state management middleware is supported.
   *
   * @param middleware - The state management middleware to check.
   * @returns true if the state management middleware is supported, false otherwise.
   */
  public isSupportStateManagementMiddleware(
    middleware: ObjectValueAsAType<typeof AppConstant.StateManagementMiddleware>
  ): boolean {
    return this.stateManagementMiddleware === middleware;
  }

  /**
   * Sets the state management middleware used in the project.
   *
   * @param stateManagementMiddleware - The state management middleware to set.
   * @remarks
   * The state management middleware is specified in the project's `package.json` file.
   * It is used to initialize the project configuration.
   */
  set setStateManagementMiddleware(stateManagementMiddleware: string) {
    this.stateManagementMiddleware = stateManagementMiddleware;
  }

  /**
   * Returns the API middleware used in the project.
   *
   * @returns The API middleware used in the project.
   * @remarks
   * The API middleware is specified in the project's `package.json` file.
   * It is used to initialize the project configuration.
   */
  get getApiMiddleware(): Array<string> {
    return this.apiMiddleware;
  }

  /**
   * Checks if the specified API middleware is supported.
   *
   * @param middleware - The API middleware to check.
   * @returns true if the API middleware is supported, false otherwise.
   */
  public isSupportApiMiddleware(
    middleware: ObjectValueAsAType<typeof AppConstant.ApiMiddleware>
  ): boolean {
    return this.apiMiddleware.includes(middleware);
  }

  /**
   * Sets the API middleware used in the project.
   *
   * @param apiMiddleware - The API middleware to set.
   * @remarks
   * The API middleware is specified in the project's `package.json` file.
   * It is used to initialize the project configuration.
   */
  set setApiMiddleware(apiMiddleware: Array<string>) {
    this.apiMiddleware = apiMiddleware;
  }

  /**
   * Returns the API base URL.
   *
   * @returns The API base URL.
   * @remarks
   * The API base URL is specified in the project's `package.json` file.
   * It is used to initialize the project configuration.
   */
  get getApiBaseURL(): string {
    return this.apiBaseURL;
  }

  /**
   * Sets the API base URL.
   *
   * @param apiBaseURL - The API base URL to set.
   * @remarks
   * The API base URL is specified in the project's `package.json` file.
   * It is used to initialize the project configuration.
   */
  set setApiBaseURL(apiBaseURL: string) {
    this.apiBaseURL = apiBaseURL;
  }

  /**
   * Returns the additional features used in the project.
   *
   * @returns The additional features used in the project.
   * @remarks
   * The additional features are specified in the project's `package.json` file.
   * They are used to initialize the project configuration.
   */
  get getAddFeatures(): Array<string> {
    return this.addFeatures;
  }

  /**
   * Checks if the specified additional feature is supported.
   *
   * @param feature - The additional feature to check.
   * @returns true if the additional feature is supported, false otherwise.
   */
  public isSupportFeature(feature: ObjectValueAsAType<typeof AppConstant.AddFeature>): boolean {
    return this.addFeatures.includes(feature);
  }

  /**
   * Sets the additional features used in the project.
   *
   * @param addFeatures - The additional features to set.
   * @remarks
   * The additional features are specified in the project's `package.json` file.
   * They are used to initialize the project configuration.
   */
  set setAddFeatures(addFeatures: Array<string>) {
    this.addFeatures = addFeatures;
  }

  /**
   * Returns the Sentry DSN URL.
   *
   * @returns The Sentry DSN URL.
   * @remarks
   * The Sentry DSN URL is specified in the project's `package.json` file.
   * It is used to initialize the Sentry client.
   */
  get getSentryDsnURL(): string {
    return this.sentryDsnURL;
  }

  /**
   * Sets the Sentry DSN URL.
   *
   * @param sentryDsnURL - The Sentry DSN URL to set.
   * @remarks
   * The Sentry DSN URL is used to initialize the Sentry client.
   * It is specified in the project's `package.json` file.
   */
  set setSentryDsnURL(sentryDsnURL: string) {
    this.sentryDsnURL = sentryDsnURL;
  }

  /**
   * Returns the Sentry organization slug.
   *
   * @returns The Sentry organization slug.
   * @remarks
   * The Sentry organization slug is used to identify the organization in Sentry.
   */
  get getSentryOrgSlug(): string {
    return this.sentryOrgSlug;
  }

  /**
   * Sets the Sentry organization slug.
   *
   * @param sentryOrgSlug - The Sentry organization slug to set.
   * @remarks
   * The Sentry organization slug is used to identify the organization in Sentry.
   */
  set setSentryOrgSlug(sentryOrgSlug: string) {
    this.sentryOrgSlug = sentryOrgSlug;
  }

  /**
   * Returns the Sentry organization project.
   *
   * @returns The Sentry organization project.
   * @remarks
   * The Sentry organization project is used to identify the project within the organization in Sentry.
   */
  get getSentryOrgProject(): string {
    return this.sentryOrgProject;
  }

  /**
   * Sets the Sentry organization project.
   *
   * @param sentryOrgProject - The Sentry organization project to set.
   * @remarks
   * The Sentry organization project is used to identify the project within the organization in Sentry.
   */
  set setSentryOrgProject(sentryOrgProject: string) {
    this.sentryOrgProject = sentryOrgProject;
  }

  /**
   * Returns the Sentry authentication token.
   *
   * @returns The Sentry authentication token.
   * @remarks
   * The Sentry authentication token is used to authenticate with Sentry.
   */
  get getSentryAuthToken(): string {
    return this.sentryAuthToken;
  }

  /**
   * Sets the Sentry authentication token.
   *
   * @param sentryAuthToken - The Sentry authentication token to set.
   * @remarks
   * The Sentry authentication token is used to authenticate with Sentry.
   */
  set setSentryAuthToken(sentryAuthToken: string) {
    this.sentryAuthToken = sentryAuthToken;
  }

  /**
   * Returns the setup environment configurations.
   *
   * @returns An array of strings representing the setup environments.
   * @remarks
   * The setup environments are configured for the project and specify the environments
   * that are supported, such as development, production, or preview.
   */
  get getSetupEnv(): Array<string> {
    return this.setupEnv;
  }

  /**
   * Checks if the specified environment is supported by the app in production.
   *
   * @param env - The environment to check.
   * @returns true if the environment is supported in production, false otherwise.
   */
  public isSupportProductionEnv(env: ObjectValueAsAType<typeof AppConstant.SetupEnv>): boolean {
    return this.setupEnv.includes(env) && env === AppConstant.SetupEnv.Production;
  }

  /**
   * Checks if the specified environment is supported by the app in development.
   *
   * @param env - The environment to check.
   * @returns true if the environment is supported in development, false otherwise.
   * @remarks
   * The app will only support the development environment if the given environment is the development environment.
   */
  public isSupportDevelopmentEnv(env: ObjectValueAsAType<typeof AppConstant.SetupEnv>): boolean {
    return this.setupEnv.includes(env) && env === AppConstant.SetupEnv.Development;
  }

  /**
   * Sets the environments that the app will support.
   *
   * @param setupEnv - The environments to support.
   * @remarks
   * The app will support all the environments in the given array and the production environment.
   * The default value of the environments is [AppConstant.SetupEnv.Development].
   */
  set setSetupEnv(setupEnv: Array<string>) {
    this.setupEnv = setupEnv;
    this.setupEnv.push(AppConstant.SetupEnv.Production);
  }

  /**
   * Returns whether to support sample bundle or not.
   * @returns Whether to support sample bundle or not.
   * @remarks
   * If the value is true, the app will support sample bundle.
   * If the value is false, the app will not support sample bundle.
   * The default value is true.
   */
  get getSupportSampleBundle(): boolean {
    return this.supportSampleBundle;
  }

  /**
   * Sets whether to support sample bundle or not.
   *
   * @param supportSampleBundle - Whether to support sample bundle or not.
   * @remarks
   * If the value is true, the app will support sample bundle.
   * If the value is false, the app will not support sample bundle.
   * The default value is false.
   */
  set setSupportSampleBundle(supportSampleBundle: boolean) {
    this.supportSampleBundle = supportSampleBundle;
  }

  /**
   * Gets the repository link.
   *
   * @returns The repository link.
   * @remarks
   * The repository link is used to generate the project's README file.
   */
  get getRepositoryLink(): string {
    return this.repositoryLink;
  }

  /**
   * Sets the repository link.
   *
   * @param repositoryLink - The repository link to set.
   * @remarks
   * The repository link is used to generate the project's README file.
   */
  set setRepositoryLink(repositoryLink: string) {
    this.repositoryLink = repositoryLink;
  }

  /**
   * Gets the value of the `nodeLinker` option for yarn v4, based on the
   * selected package manager.
   *
   * When using yarn v4, the `nodeLinker` option is mandatory. This method
   * returns the correct value for this option based on the selected package
   * manager.
   *
   * @returns The value of the `nodeLinker` option for yarn v4.
   */
  get getYarnV4NodeLinkerValue(): string {
    switch (this.packageManager) {
      case AppConstant.PackageManager.Yarn:
        return 'node-modules';
      case AppConstant.PackageManager.Npm:
        return 'node-modules';
      case AppConstant.PackageManager.Pnpm:
        return 'pnpm';
      default:
        return 'node-modules';
    }
  }

  /**
   * Resets all the answers to their default values.
   *
   * @remarks
   * This is a utility method that can be used to reset all the answers to their default values.
   * It is useful when you want to start fresh, or when you want to reset the answers after a process has been completed.
   */
  public resetQuestionAnswer(): void {
    this.projectName = '';
    this.bundleIdentifier = '';
    this.minAndroidSdkVersion = 0;
    this.minIOSSdkVersion = 0.0;
    this.supportEAS = false;
    this.projectID = '';
    this.projectSlug = '';
    this.stateManagement = '';
    this.stateManagementMiddleware = '';
    this.apiMiddleware = [];
    this.apiBaseURL = '';
    this.addFeatures = [];
    this.setupEnv = [];
    this.supportSampleBundle = false;
    this.repositoryLink = '';
  }
}
