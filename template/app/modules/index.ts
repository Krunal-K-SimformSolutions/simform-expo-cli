export * from './_layout.js';
export * from './+not-found.js';

/**
 *
 */
export const ModulesScreenTemplate = (): string => {
  return `
    import { Stack } from 'expo-router';
    import React from 'react';
    import { useTranslation } from 'react-i18next';
    import { CustomText } from '../components';
    import { StorageKeyConst, StringConst } from '../constants';
    import { setStorageItem } from '../utils';

    /**
     * The Modules Screen.
     */
    const ModulesScreen = () => {
      const { t, i18n } = useTranslation();

      return (
        <>
          <Stack.Screen options={{ title: t(StringConst.Modules.home.title) }} />
          <CustomText variant="semiBold16">{StringConst.Modules.home.message}</CustomText>
          <CustomText
            variant="medium14"
            onPress={() => {
              setStorageItem(StorageKeyConst.appTheme, 'dark');
            }}
          >
            {StringConst.Common.dark}
          </CustomText>
          <CustomText
            variant="medium14"
            onPress={() => {
              setStorageItem(StorageKeyConst.appTheme, 'light');
            }}
          >
            {StringConst.Common.light}
          </CustomText>
          <CustomText
            variant="medium14"
            onPress={() => {
              i18n.changeLanguage('en');
            }}
          >
            {StringConst.Common.en}
          </CustomText>
          <CustomText
            variant="medium14"
            onPress={() => {
              i18n.changeLanguage('hi');
            }}
          >
            {StringConst.Common.hi}
          </CustomText>
        </>
      );
    };

    export default ModulesScreen;
  `;
};
