import { QuestionAnswer } from '@/questions';

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

  const isTranslations = variables.isSupportFeature('Translations');
  const isSentry = variables.isSupportFeature('Sentry');
  const sentryOrgProject = variables.getSentryOrgProject;
  const sentryOrgSlug = variables.getSentryOrgSlug;

  return `
    const getEnvironmentConfig = (environment) => {
      const environmentJson = ${JSON.stringify(
        setupEnv.reduce((acc, env) => {
          return {
            ...acc,
            [env]: {
              appName: `${projectName}-${env}`,
              bundleIdentifier: `${bundleIdentifier}${isSupportSampleBundle ? '' : '.' + env}`
            }
          };
        }, {})
      )};
      return environmentJson[environment] ?? environmentJson['development'];
    };

    const defineConfig = ({ config }) => {
      const APP_ENV = process.env.NODE_ENV ?? process.env.ENVIRONMENT ?? 'development';
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
          ${isTranslations ? `'expo-localization',` : ''}
          [
            'expo-build-properties',
            {
              android: {
                minSdkVersion: ${androidSdk}
              },
              ios: {
                deploymentTarget: '${iosSdk}'
              }
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
          API_URL: process.env.API_URL,
          SENTRY_URL: process.env.SENTRY_URL,
          ENVIRONMENT: process.env.ENVIRONMENT
        }
      };
    };

    export default defineConfig;
  `;
};
