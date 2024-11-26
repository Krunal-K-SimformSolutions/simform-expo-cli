import path from 'path';
import fs from 'fs-extra';
import {
  ApiTemplate,
  AwsAPIConfigTemplate,
  AwsAPITypesTemplate,
  AwsTemplate,
  AxiosAPIConfigTemplate,
  AxiosAPITypesTemplate,
  AxiosTemplate,
  CommonAPIConfigTemplate,
  CommonConstTemplate,
  CommonTokenTemplate,
  CommonTypesTemplate,
  ConfigTemplate,
  FetchAPIConfigTemplate,
  FetchAPITypesTemplate,
  FetchTemplate,
  GraphQlConfigTemplate,
  SentryConfigTemplate,
  SocketTemplate,
  TranslationConfigTemplate,
  WebSocketConstTemplate,
  WebSocketManagerTemplate,
  WebSocketSagaTemplate,
  WebSocketTypesTemplate
} from '../../template/index.js';
import { AppConstant, getTheme } from '../constants/index.js';
import { QuestionAnswer } from '../questions/index.js';
import { showError, writeJsxToTsFile } from '../utils/index.js';
import type { Indicators } from '../utils/index.js';

/**
 *
 */
export const generateConfigs = async (appPath: string, spinner: Indicators) => {
  const colors = getTheme();

  try {
    const variables = QuestionAnswer.instance;

    const isAxios = variables.isSupportApiMiddleware(AppConstant.ApiMiddleware.Axios);
    const isAWSAmplify = variables.isSupportApiMiddleware(AppConstant.ApiMiddleware.AWSAmplify);
    const isFetch = variables.isSupportApiMiddleware(AppConstant.ApiMiddleware.Fetch);

    const isReduxSaga = variables.isSupportStateManagementMiddleware(
      AppConstant.StateManagementMiddleware.ReduxSaga
    );
    const isGraphQL = variables.isSupportStateManagement(AppConstant.StateManagement.GraphQL);

    const isSentry = variables.isSupportFeature(AppConstant.AddFeature.Sentry);
    const isTranslations = variables.isSupportFeature(AppConstant.AddFeature.Translations);
    const isSocket = variables.isSupportFeature(AppConstant.AddFeature.Socket);

    // Create configs directory if it doesn't exist
    const configsPath = path.join(appPath, 'configs');
    await fs.mkdir(configsPath, { recursive: true });

    if (isAWSAmplify || isAxios || isFetch) {
      // Create api directory if it doesn't exist
      const apiPath = path.join(configsPath, 'api');
      await fs.mkdir(apiPath, { recursive: true });

      if (isAWSAmplify) {
        // Create aws directory if it doesn't exist
        const awsPath = path.join(apiPath, 'aws');
        await fs.mkdir(awsPath, { recursive: true });

        // Create aws AwsAPIConfig.ts file
        await writeJsxToTsFile(path.join(awsPath, 'AwsAPIConfig.ts'), AwsAPIConfigTemplate());

        // Create aws AwsAPITypes.ts file
        await writeJsxToTsFile(path.join(awsPath, 'AwsAPITypes.ts'), AwsAPITypesTemplate());

        // Create aws index.ts file
        await writeJsxToTsFile(path.join(awsPath, 'index.ts'), AwsTemplate());
      }

      if (isAxios) {
        // Create axios directory if it doesn't exist
        const axiosPath = path.join(apiPath, 'axios');
        await fs.mkdir(axiosPath, { recursive: true });

        // Create axios AxiosAPIConfig.ts file
        await writeJsxToTsFile(path.join(axiosPath, 'AxiosAPIConfig.ts'), AxiosAPIConfigTemplate());

        // Create axios AxiosAPITypes.ts file
        await writeJsxToTsFile(path.join(axiosPath, 'AxiosAPITypes.ts'), AxiosAPITypesTemplate());

        // Create axios index.ts file
        await writeJsxToTsFile(path.join(axiosPath, 'index.ts'), AxiosTemplate());
      }

      if (isFetch) {
        // Create fetch directory if it doesn't exist
        const fetchPath = path.join(apiPath, 'fetch');
        await fs.mkdir(fetchPath, { recursive: true });

        // Create fetch FetchAPIConfig.ts file
        await writeJsxToTsFile(path.join(fetchPath, 'FetchAPIConfig.ts'), FetchAPIConfigTemplate());

        // Create fetch FetchAPITypes.ts file
        await writeJsxToTsFile(path.join(fetchPath, 'FetchAPITypes.ts'), FetchAPITypesTemplate());

        // Create fetch index.ts file
        await writeJsxToTsFile(path.join(fetchPath, 'index.ts'), FetchTemplate());
      }

      // Create api CommonAPIConfig.ts file
      await writeJsxToTsFile(path.join(apiPath, 'CommonAPIConfig.ts'), CommonAPIConfigTemplate());

      // Create api CommonConst.ts file
      await writeJsxToTsFile(path.join(apiPath, 'CommonConst.ts'), CommonConstTemplate());

      // Create api CommonToken.ts file
      await writeJsxToTsFile(path.join(apiPath, 'CommonToken.ts'), CommonTokenTemplate());

      // Create api CommonTypes.ts file
      await writeJsxToTsFile(path.join(apiPath, 'CommonTypes.ts'), CommonTypesTemplate());

      // Create api index.ts file
      await writeJsxToTsFile(path.join(apiPath, 'index.ts'), ApiTemplate());
    }

    if (isSocket) {
      // Create socket directory if it doesn't exist
      const socketPath = path.join(configsPath, 'socket');
      await fs.mkdir(socketPath, { recursive: true });

      // Create socket WebSocketConst.ts file
      await writeJsxToTsFile(path.join(socketPath, 'WebSocketConst.ts'), WebSocketConstTemplate());

      // Create socket WebSocketManager.ts file
      await writeJsxToTsFile(
        path.join(socketPath, 'WebSocketManager.ts'),
        WebSocketManagerTemplate()
      );

      if (isReduxSaga) {
        // Create socket WebSocketSaga.ts file
        await writeJsxToTsFile(path.join(socketPath, 'WebSocketSaga.ts'), WebSocketSagaTemplate());
      }

      // Create socket WebSocketTypes.ts file
      await writeJsxToTsFile(path.join(socketPath, 'WebSocketTypes.ts'), WebSocketTypesTemplate());

      // Create socket index.ts file
      await writeJsxToTsFile(path.join(socketPath, 'index.ts'), SocketTemplate());
    }

    if (isGraphQL) {
      // Create configs GraphQlConfig.ts file
      await writeJsxToTsFile(path.join(configsPath, 'GraphQlConfig.ts'), GraphQlConfigTemplate());
    }

    if (isSentry) {
      // Create configs SentryConfig.ts file
      await writeJsxToTsFile(path.join(configsPath, 'SentryConfig.ts'), SentryConfigTemplate());
    }

    if (isTranslations) {
      // Create configs TranslationConfig.ts file
      await writeJsxToTsFile(
        path.join(configsPath, 'TranslationConfig.ts'),
        TranslationConfigTemplate()
      );
    }

    // Create configs index.ts file
    await writeJsxToTsFile(path.join(configsPath, 'index.ts'), ConfigTemplate());
  } catch (error) {
    showError(error, spinner, colors);
  }
};
