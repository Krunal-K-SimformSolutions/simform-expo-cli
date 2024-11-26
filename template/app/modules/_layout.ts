import { QuestionAnswer, AppConstant } from '../../../src/index.js';

/**
 *
 */
export const ModulesLayoutTemplate = () => {
  const variables = QuestionAnswer.instance;

  const isReactRedux = variables.isSupportStateManagement(AppConstant.StateManagement.ReactRedux);
  const isGraphQL = variables.isSupportStateManagement(AppConstant.StateManagement.GraphQL);

  return `
  import { useFonts } from 'expo-font';
  import { Stack } from 'expo-router';
  import * as SplashScreen from 'expo-splash-screen';
  import { StatusBar } from 'expo-status-bar';
  import { GestureHandlerRootView } from 'react-native-gesture-handler';
  import { SafeAreaProvider } from 'react-native-safe-area-context';
  import React, { useEffect${isGraphQL ? ', useState' : ''} } from 'react';
  import { Text, TextInput, ActivityIndicator, StyleSheet, View } from 'react-native';
  import { Toast, ToastHolder } from '../components';
  import { ApplicationStyles } from '../themes';
  import { Fonts } from "../assets";
  ${
    isReactRedux
      ? `
          import { Provider } from 'react-redux';
          import { PersistGate } from 'redux-persist/integration/react';
          import { Store } from '../redux';
        `
      : ''
  }
  ${
    isGraphQL
      ? `
          import { ApolloProvider } from '@apollo/client';
          import { isNil } from 'lodash';
          import { persistor, client, initApolloClient } from '../configs';
        `
      : ''
  }

  // Prevent the splash screen from auto-hiding before asset loading is complete.
  SplashScreen.preventAutoHideAsync();

  // Disable font scaling from  system settings.
  // @ts-expect-error - Allow font scaling to be disabled.
  Text.defaultProps = Text.defaultProps ?? {};
  // @ts-expect-error - Allow font scaling to be disabled.
  Text.defaultProps.allowFontScaling = false;
  // @ts-expect-error - Allow font scaling to be disabled.
  TextInput.defaultProps = TextInput.defaultProps ?? {};
  // @ts-expect-error - Allow font scaling to be disabled.
  TextInput.defaultProps.allowFontScaling = false;

  /**
   * Layout component that sets up the
   * navigation stack for the application.
   */
  const RootLayout = () => {
    const [loaded] = useFonts(Fonts);
    ${isGraphQL ? 'const [loadingCache, setLoadingCache] = useState(true);' : ''}
    
    useEffect(() => {
      ${
        isGraphQL
          ? `
              persistor.restore().then(() => {
                initApolloClient();
                setLoadingCache(false);
              });
            `
          : ''
      }
      
      return () => {
        ToastHolder.clearToast();
      };
    }, []);

    useEffect(() => {
      if (loaded${isGraphQL ? ' && !loadingCache' : ''}) {
        SplashScreen.hideAsync();
      }
    }, [loaded${isGraphQL ? ', loadingCache' : ''}]);

    if (!loaded${isGraphQL ? ' || loadingCache || isNil(client)' : ''}) {
      return (
        <View
          style={StyleSheet.flatten([
            ApplicationStyles.viewStyle.screen,
            ApplicationStyles.viewStyle.centerAlign
          ])}
        >
          <ActivityIndicator size="large" />
        </View>
      );
    }

    return (
      <GestureHandlerRootView style={ApplicationStyles.viewStyle.screen}>
        <SafeAreaProvider style={ApplicationStyles.viewStyle.screen}>
          <StatusBar style="auto" />
          ${
            isReactRedux
              ? `
                  <Provider store={Store.store}>
                    <PersistGate loading={null} persistor={Store.persistor}>
                      <Stack>
                        <Stack.Screen name="modules" />
                        <Stack.Screen name="+not-found" />
                      </Stack>
                    </PersistGate>
                  </Provider>
                `
              : ''
          }
          ${
            isGraphQL
              ? `
                  <ApolloProvider client={client}>
                    <Stack>
                      <Stack.Screen name="modules" />
                      <Stack.Screen name="+not-found" />
                    </Stack>
                  </ApolloProvider>
                `
              : ''
          }
          ${
            !isGraphQL && !isReactRedux
              ? `
                  <Stack>
                    <Stack.Screen name="modules" />
                    <Stack.Screen name="+not-found" />
                  </Stack>
                `
              : ''
          }
          <Toast
            translucent
            numberOfLines={2}
            toastPosition={'top'}
            ref={(ref) => ToastHolder.setToast(ref)}
          />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  export default RootLayout;
  `;
};
