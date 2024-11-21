export class QuestionAnswer {
  static #instance: QuestionAnswer;

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

  private constructor() {}

  public static get instance(): QuestionAnswer {
    if (!QuestionAnswer.#instance) {
      QuestionAnswer.#instance = new QuestionAnswer();
    }

    return QuestionAnswer.#instance;
  }

  get getProjectName(): string {
    return this.projectName;
  }

  get getProjectNameWithLowerCase(): string {
    return this.projectName.toLowerCase();
  }

  set setProjectName(projectName: string) {
    this.projectName = projectName;
  }

  get getBundleIdentifier(): string {
    return this.bundleIdentifier;
  }

  set setBundleIdentifier(bundleIdentifier: string) {
    this.bundleIdentifier = bundleIdentifier;
  }

  get getMinAndroidSdkVersion(): number {
    return this.minAndroidSdkVersion;
  }

  set setMinAndroidSdkVersion(minAndroidSdkVersion: number | undefined) {
    this.minAndroidSdkVersion = minAndroidSdkVersion ?? 0;
  }

  get getMinIOSSdkVersion(): number {
    return this.minIOSSdkVersion;
  }

  set setMinIOSSdkVersion(minIOSSdkVersion: number | undefined) {
    this.minIOSSdkVersion = minIOSSdkVersion ?? 0.0;
  }

  get getSupportEAS(): boolean {
    return this.supportEAS;
  }

  set setSupportEAS(supportEAS: boolean) {
    this.supportEAS = supportEAS;
  }

  get getProjectID(): string {
    return this.projectID;
  }

  set setProjectID(projectID: string) {
    this.projectID = projectID;
  }

  get getProjectSlug(): string {
    return this.projectSlug;
  }

  set setProjectSlug(projectSlug: string) {
    this.projectSlug = projectSlug;
  }

  get getStateManagement(): string {
    return this.stateManagement;
  }

  get isReactReduxStateManagement(): boolean {
    return this.stateManagement === 'ReactRedux';
  }

  set setStateManagement(stateManagement: string) {
    this.stateManagement = stateManagement;
  }

  get getStateManagementMiddleware(): string {
    return this.stateManagementMiddleware;
  }

  get isReduxSagaStateManagementMiddleware(): boolean {
    return this.stateManagementMiddleware === 'ReduxSaga';
  }

  set setStateManagementMiddleware(stateManagementMiddleware: string) {
    this.stateManagementMiddleware = stateManagementMiddleware;
  }

  get getApiMiddleware(): Array<string> {
    return this.apiMiddleware;
  }

  public isSupportApiMiddleware(middleware: string): boolean {
    return this.apiMiddleware.includes(middleware);
  }

  set setApiMiddleware(apiMiddleware: Array<string>) {
    this.apiMiddleware = apiMiddleware;
  }

  get getApiBaseURL(): string {
    return this.apiBaseURL;
  }

  set setApiBaseURL(apiBaseURL: string) {
    this.apiBaseURL = apiBaseURL;
  }

  get getAddFeatures(): Array<string> {
    return this.addFeatures;
  }

  public isSupportFeature(feature: string): boolean {
    return this.addFeatures.includes(feature);
  }

  set setAddFeatures(addFeatures: Array<string>) {
    this.addFeatures = addFeatures;
  }

  get getSentryDsnURL(): string {
    return this.sentryDsnURL;
  }

  set setSentryDsnURL(sentryDsnURL: string) {
    this.sentryDsnURL = sentryDsnURL;
  }

  get getSentryOrgSlug(): string {
    return this.sentryOrgSlug;
  }

  set setSentryOrgSlug(sentryOrgSlug: string) {
    this.sentryOrgSlug = sentryOrgSlug;
  }

  get getSentryOrgProject(): string {
    return this.sentryOrgProject;
  }

  set setSentryOrgProject(sentryOrgProject: string) {
    this.sentryOrgProject = sentryOrgProject;
  }

  get getSentryAuthToken(): string {
    return this.sentryAuthToken;
  }

  set setSentryAuthToken(sentryAuthToken: string) {
    this.sentryAuthToken = sentryAuthToken;
  }

  get getSetupEnv(): Array<string> {
    return this.setupEnv;
  }

  set setSetupEnv(setupEnv: Array<string>) {
    this.setupEnv = setupEnv;
  }

  get getSupportSampleBundle(): boolean {
    return this.supportSampleBundle;
  }

  set setSupportSampleBundle(supportSampleBundle: boolean) {
    this.supportSampleBundle = supportSampleBundle;
  }

  get getRepositoryLink(): string {
    return this.repositoryLink;
  }

  set setRepositoryLink(repositoryLink: string) {
    this.repositoryLink = repositoryLink;
  }

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
