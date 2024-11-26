import { QuestionAnswer, AppConstant } from '../src/index.js';

/**
 *
 */
export const AppConfigTemplate = (): string => {
  const variables = QuestionAnswer.instance;

  const projectName = variables.getProjectName;
  const bundleIdentifier = variables.getBundleIdentifier;
  const setupEnv = variables.getSetupEnv;
  const isSupportEAS = variables.getSupportEAS;
  const projectSlug = variables.getProjectSlug;
  const projectId = variables.getProjectID;
  const isSupportSampleBundle = variables.getSupportSampleBundle;
  const androidSdk = variables.getMinAndroidSdkVersion;
  const iosSdk = variables.getMinIOSSdkVersion;

  const isSentry = variables.isSupportFeature(AppConstant.AddFeature.Sentry);
  const isTranslations = variables.isSupportFeature(AppConstant.AddFeature.Translations);

  const sentryOrgProject = variables.getSentryOrgProject;
  const sentryOrgSlug = variables.getSentryOrgSlug;

  return `
    /**
     * Gets the environment config for the given environment.
     * If the environment is not found, then it returns the development config.
     * @param {string} environment - The environment to get the config for.
     * @returns {object} - The environment config.
     */
    const getEnvironmentConfig = (environment) => {
      const environmentJson = ${JSON.stringify(
        setupEnv.reduce((acc, env) => {
          return {
            ...acc,
            [env]: {
              // @ts-expect-error - Type 'string' is not assignable to type env support.
              appName: `${projectName}${variables.isSupportProductionEnv(env) ? '' : ` (${env})`}`,
              // @ts-expect-error - Type 'string' is not assignable to type env support.
              bundleIdentifier: `${bundleIdentifier}${isSupportSampleBundle || variables.isSupportProductionEnv(env) ? '' : '.' + env}`
            }
          };
        }, {})
      )};
      return environmentJson[environment] ?? environmentJson['development'];
    };

    /**
     * Defines the configuration for the application based on the current environment.
     *
     * @param {Object} config - The configuration object to be extended.
     * @param {string} config.name - The name of the application.
     * @param {string} config.slug - The slug for the application.
     * @param {string} config.version - The version of the application.
     * @param {string} config.orientation - The orientation of the application.
     * @param {string} config.icon - The path to the application icon.
     * @param {string} config.scheme - The scheme for the application.
     * @param {string} config.userInterfaceStyle - The user interface style setting.
     * @param {Object} config.splash - The splash screen configuration.
     * @param {Object} config.ios - The iOS specific configuration.
     * @param {Object} config.android - The Android specific configuration.
     * @param {Object} config.web - The web specific configuration.
     * @param {Array} config.plugins - List of plugins used in the application.
     * @param {Object} config.experiments - Experimental features configuration.
     * @param {Object} config.extra - Additional extra configuration values.
     * @returns {Object} The extended configuration object with environment-specific values.
     */
    const defineConfig = ({ config }) => {
      const APP_ENV = process.env.NODE_ENV ?? 'development';
      const { appName, bundleIdentifier } = getEnvironmentConfig(APP_ENV);

      return {
        ...config,
        name: appName,
        ${isSupportEAS ? `slug: '${projectSlug}',` : ''}
        version: '1.0.0',
        orientation: 'portrait',
        icon: './app/assets/icons/appIcon.png',
        scheme: '${projectName}',
        userInterfaceStyle: 'automatic',
        splash: {
          image: './app/assets/images/splashScreen.png',
          resizeMode: 'contain'
        },
        ios: {
          bundleIdentifier: bundleIdentifier,
          infoPlist: {
            NSCameraUsageDescription: 'This app requires to access your photo library'
          }
        },
        android: {
          adaptiveIcon: {
            foregroundImage: './app/assets/icons/adaptiveIcon.png',
            backgroundColor: '#ffffff'
          },
          package: bundleIdentifier,
          permissions: ['CAMERA']
        },
        web: {
          bundler: 'metro',
          output: 'static'
        },
        plugins: [
          ${isTranslations ? "'expo-localization'," : ''}
          [
            'expo-router',
            {
              root: './app/modules'
            }
          ],
          [
            'expo-build-properties',
            {
              android: {
                minSdkVersion: ${androidSdk}
              },
              ios: {
                deploymentTarget: '${iosSdk.toFixed(1)}'
              }
            }
          ],
          [
            "expo-splash-screen",
            {
              "image": "./app/assets/images/splashScreen.png",
              "resizeMode": "contain",
              "backgroundColor": "#ffffff"
            }
          ],
          ${
            isSentry
              ? JSON.stringify([
                  '@sentry/react-native/expo',
                  {
                    organization: `${sentryOrgSlug}`,
                    project: `${sentryOrgProject}`
                    // If you are using a self-hosted instance, update the value of the url property
                    // to point towards your self-hosted instance. For example, https://self-hosted.example.com/.
                    // url: 'https://sentry.simformsolutions.com/'
                  }
                ])
              : ''
          }
        ],
        experiments: {
          typedRoutes: true
        },
        extra: {
          ${isSupportEAS ? `eas: { projectId: '${projectId}' },` : ''}
        }
      };
    };

    export default defineConfig;
  `;
};
