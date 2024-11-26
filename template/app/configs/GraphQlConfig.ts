/**
 *
 */
export const GraphQlConfigTemplate = (): string => {
  return `
    import {
      ApolloClient,
      InMemoryCache,
      createHttpLink,
      ApolloLink,
      type NormalizedCacheObject
    } from '@apollo/client';
    import { setContext } from '@apollo/client/link/context';
    import { onError } from '@apollo/client/link/error';
    import AsyncStorage from '@react-native-async-storage/async-storage';
    import { CachePersistor, AsyncStorageWrapper } from 'apollo3-cache-persist';
    import { AppConst, StorageKeyConst } from '../constants';
    import { logger } from '../utils';

    /* Creating a new instance of the InMemoryCache. */
    const cache: InMemoryCache = new InMemoryCache();

    /* Creating a new instance of the CachePersistor. */
    export const persistor: CachePersistor<NormalizedCacheObject> = new CachePersistor({
      cache,
      storage: new AsyncStorageWrapper(AsyncStorage),
      debug: AppConst.isDevelopment,
      key: StorageKeyConst.graphql
    });

    export let client: ApolloClient<NormalizedCacheObject>;

    const authLink: ApolloLink = setContext(async (_, { headers }) => {
      logger.i('GraphQL', { headers });
      // TODO: You can add authorization token like below
      // const state = reduxStore?.store?.getState();
      // const authToken = state?.auth?.loginData?.access_token;
      // const token = \`Bearer \${authToken}\`;
      // return {
      //   headers: {
      //     ...headers,
      //     authorization: token
      //   }
      // };
    });

    /**
     * Log any GraphQL errors or network error that occurred
     */
    const errorLink = onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.forEach(({ message, locations, path }) =>
          logger.i('GraphQL', \`[GraphQL error]: Message: \${message}, Location: \${locations}, Path: \${path}\`)
        );
      if (networkError) {
        logger.i('GraphQL', \`[Network error]: \${networkError}\`);
      }
    });

    /**
     * It creates an Apollo Client instance and assigns it to the client variable
     */
    export const initApolloClient = (): void => {
      const httpLink: ApolloLink = createHttpLink({ uri: AppConst.apiUrl });
      const link = ApolloLink.from([errorLink, authLink.concat(httpLink)]);
      client = new ApolloClient({
        link: link,
        cache: cache,
        connectToDevTools: AppConst.isDevelopment,
        name: StorageKeyConst.graphqlClient,
        version: '1.0',
        queryDeduplication: false
      });
    };

    /**
     * It clears the cache of the apollo cache store
     * @returns {void}.
     */
    export const clearCache = (): void => {
      if (!persistor) {
        return;
      }
      persistor.purge();
    };
  `;
};
