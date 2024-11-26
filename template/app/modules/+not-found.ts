/**
 *
 */
export const NotFoundScreenTemplate = (): string => {
  return `
    import { Link, Stack } from 'expo-router';
    import React from 'react';
    import { useTranslation } from 'react-i18next';
    import { CustomText } from '../components';
    import { StringConst, ROUTES } from '../constants';
    import { scale } from '../themes';

    /**
     * The Not Found Screen.
     */
    const NotFoundScreen = () => {
      const { t } = useTranslation();

      return (
        <>
          <Stack.Screen options={{ title: t(StringConst.Modules.notFound.title) }} />
          <CustomText variant="semiBold16">{StringConst.Modules.notFound.message}</CustomText>
          <Link href={ROUTES.Modules} style={{ paddingHorizontal: scale(5) }}>
            <CustomText variant="medium14">{StringConst.Modules.notFound.home}</CustomText>
          </Link>
        </>
      );
    }

    export default NotFoundScreen;
  `;
};
